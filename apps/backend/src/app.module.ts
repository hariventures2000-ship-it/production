import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectRequestsModule } from './modules/project-requests/project-requests.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { TeamsModule } from './modules/teams/teams.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SupportModule } from './modules/support/support.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ChatModule } from './modules/chat/chat.module';
import { ClientPortalModule } from './modules/client-portal/client-portal.module';
import { BillingModule } from './modules/billing/billing.module';
import { AiModule } from './modules/ai/ai.module';
import { AiAssistantModule } from './modules/ai-assistant/ai-assistant.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { DatabaseModule } from './database/database.module';
import { QueuesModule } from './queues/queues.module';
import { APP_GUARD } from '@nestjs/core';
import { CsrfGuard } from './common/guards/csrf.guard';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { validateEnv } from './config/env.validation';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';

@Module({
  imports: [
    // ─── CONFIG ─────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),

    // ─── SCHEDULE ───────────────────────────────────────────────────
    ScheduleModule.forRoot(),

    // ─── DATABASE ───────────────────────────────────────────────────
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected', () => console.log('✅  MongoDB Atlas connected'));
          connection.on('error', (err: Error) => console.error('❌  MongoDB error:', err));
          return connection;
        },
      }),
    }),

    // ─── RATE LIMITING ──────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    // ─── QUEUES (BullMQ via @nestjs/bull) ──────────────────────────
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.getOrThrow<string>('REDIS_URL'),
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      }),
    }),

    // ─── FEATURE MODULES ────────────────────────────────────────────
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    ProjectsModule,
    ProjectRequestsModule,
    TasksModule,
    SprintsModule,
    TeamsModule,
    AttendanceModule,
    LeavesModule,
    ClientsModule,
    ClientPortalModule,
    BillingModule,
    InvoicesModule,
    PaymentsModule,
    SupportModule,
    TicketsModule,
    MeetingsModule,
    DocumentsModule,
    NotificationsModule,
    ChatModule,
    AiModule,
    AiAssistantModule,
    AnalyticsModule,
    HealthModule,
    AuditModule,
    AlertsModule,
    CandidatesModule,
    QueuesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ThrottlerExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
