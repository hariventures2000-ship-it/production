import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as crypto from 'crypto';

describe('Phase 4 Billing Security & Razorpay Integration E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;
  
  // Mock JWT Tokens
  let clientAToken: string;
  let clientBToken: string;

  // Mock Resource IDs
  let clientAInvoiceId: string;
  let clientAPaymentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    connection = app.get(getConnectionToken());
    
    // Setup standard mocks
    clientAToken = 'MOCK_JWT_CLIENT_A';
    clientBToken = 'MOCK_JWT_CLIENT_B';
    
    clientAInvoiceId = 'MOCK_INVOICE_ID_A';
    clientAPaymentId = 'MOCK_PAYMENT_ID_A';
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Invoice Ownership Isolation', () => {
    it('should reject Client B trying to view Client A invoice', () => {
      return request(app.getHttpServer())
        .get(`/v1/client/billing/invoices/${clientAInvoiceId}`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404);
    });

    it('should reject Client B trying to initiate payment for Client A invoice', () => {
      return request(app.getHttpServer())
        .post(`/v1/client/billing/invoices/${clientAInvoiceId}/pay`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404);
    });
  });

  describe('Receipt Ownership Isolation', () => {
    it('should reject Client B trying to download Client A receipt', () => {
      return request(app.getHttpServer())
        .get(`/v1/client/billing/receipts/${clientAPaymentId}`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404);
    });
  });

  describe('Webhook Security', () => {
    it('should reject razorpay webhooks with missing signature', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/razorpay')
        .send({ event: 'payment.captured' })
        .expect(200) // The controller returns HTTP 200 with {success:false} per standard webhook practice
        .expect((res) => {
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Missing signature');
        });
    });

    it('should reject razorpay webhooks with spoofed signature', () => {
      return request(app.getHttpServer())
        .post('/v1/webhooks/razorpay')
        .set('x-razorpay-signature', 'SPOOFED_SIGNATURE_INVALID')
        .send({ event: 'payment.captured', payload: {} })
        .expect(400); // Bad Request from Service
    });

    it('should accept razorpay webhooks with valid cryptographically signed payload', () => {
      const payload = { event: 'payment.captured', payload: { payment: { entity: { order_id: '123' } } } };
      // Note: We use the dummy secret standard for E2E
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
      const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

      return request(app.getHttpServer())
        .post('/v1/webhooks/razorpay')
        .set('x-razorpay-signature', signature)
        .send(payload)
        .expect(200); 
    });
  });
});
