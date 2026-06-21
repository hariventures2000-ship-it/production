import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Phase 6 Enterprise Observability & Hardening E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;
  
  let clientToken: string;
  let ceoToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    connection = app.get(getConnectionToken());
    
    // Setup standard mocks
    clientToken = 'MOCK_JWT_CLIENT';
    ceoToken = 'MOCK_JWT_CEO';
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Enterprise Health Checks', () => {
    it('should allow public access to /health', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect({ status: 'ok' });
    });

    it('should block unauthenticated access to /health/db', () => {
      return request(app.getHttpServer())
        .get('/health/db')
        .expect(401);
    });

    it('should block clients from accessing /health/db', () => {
      return request(app.getHttpServer())
        .get('/health/db')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });
  });

  describe('Executive Analytics Dashboards', () => {
    it('should block clients from accessing CEO dashboard', () => {
      return request(app.getHttpServer())
        .get('/v1/analytics/ceo-dashboard')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });

    it('should block clients from accessing MD dashboard', () => {
      return request(app.getHttpServer())
        .get('/v1/analytics/md-dashboard')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(403);
    });

    it('should enforce Analytics Throttling via Headers', () => {
      return request(app.getHttpServer())
        .get('/v1/analytics/ceo-dashboard')
        .set('Authorization', `Bearer ${ceoToken}`)
        .expect((res) => {
          // Throttler middleware injects headers
          expect(res.headers['x-ratelimit-limit']).toBeDefined();
        });
    });
  });

  describe('Request ID Correlation', () => {
    it('should inject x-request-id header on public routes', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-request-id']).toBeDefined();
        });
    });

    it('should reflect an incoming x-request-id', () => {
      const customId = 'req-trace-12345';
      return request(app.getHttpServer())
        .get('/health')
        .set('x-request-id', customId)
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-request-id']).toBe(customId);
        });
    });
  });
});
