import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const port = configService.get<number>('PORT', 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  // ─── SECURITY MIDDLEWARE ────────────────────────────────────────────
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // For Swagger UI
        styleSrc: ["'self'", "'unsafe-inline'"], // For Swagger UI
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        connectSrc: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  }));
  app.use(cookieParser());

  // ─── CORS ───────────────────────────────────────────────────────────
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', frontendUrl)
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  });

  // ─── GLOBAL PREFIX ──────────────────────────────────────────────────
  app.setGlobalPrefix('v1');

  // ─── GLOBAL PIPES ───────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown fields
      forbidNonWhitelisted: true, // Reject unknown fields
      transform: true,            // Auto-transform types
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── GLOBAL FILTERS ─────────────────────────────────────────────────
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ─── GLOBAL INTERCEPTORS ────────────────────────────────────────────
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // ─── SWAGGER (dev/staging only) ─────────────────────────────────────
  if (configService.get<boolean>('SWAGGER_ENABLED', true)) {
    const swaggerPath = configService.get<string>('SWAGGER_PATH', 'api/docs');
    const config = new DocumentBuilder()
      .setTitle('Hariventure Digital Production API')
      .setDescription('Enterprise SaaS Platform — REST API Documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addCookieAuth('refreshToken')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('employees', 'Employee management')
      .addTag('projects', 'Project management')
      .addTag('tasks', 'Task management & Kanban')
      .addTag('sprints', 'Sprint management')
      .addTag('teams', 'Team management')
      .addTag('hr', 'HR & Recruitment')
      .addTag('clients', 'Client management')
      .addTag('invoices', 'Invoice & Finance')
      .addTag('analytics', 'Analytics & Reports')
      .addTag('ai', 'AI-powered features')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
      },
    });

    console.log(`📚 Swagger docs: http://localhost:${port}/${swaggerPath}`);
  }

  // ─── START ──────────────────────────────────────────────────────────
  await app.listen(port);

  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║     HARIVENTURE DIGITAL PRODUCTION — API Server         ║
  ╠══════════════════════════════════════════════════════════╣
  ║  🚀  Server:   http://localhost:${port}                    ║
  ║  🌍  Env:      ${nodeEnv.padEnd(10)}                         ║
  ║  📚  Docs:     http://localhost:${port}/api/docs            ║
  ╚══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
