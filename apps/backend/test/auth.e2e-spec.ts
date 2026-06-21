import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env explicitly for tests
dotenv.config({ path: resolve(process.cwd(), '.env') });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/v1/auth/client/login (POST)', () => {
    it('should reject invalid emails', () => {
      return request(app.getHttpServer())
        .post('/auth/client/login')
        .send({ email: 'not-an-email' })
        .expect(400);
    });

    it('should require email field', () => {
      return request(app.getHttpServer())
        .post('/auth/client/login')
        .send({})
        .expect(400);
    });
  });

  describe('/v1/auth/internal/login (POST)', () => {
    it('should reject empty payloads', () => {
      return request(app.getHttpServer())
        .post('/auth/internal/login')
        .send({})
        .expect(400);
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/internal/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);
    });
  });
});
