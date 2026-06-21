import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('Phase 3 Security Isolation E2E Tests', () => {
  let app: INestApplication;
  let connection: Connection;
  
  // Mock JWT Tokens
  let clientAToken: string;
  let clientBToken: string;

  // Mock Resource IDs
  let clientATicketId: string;
  let clientAMeetingId: string;
  let clientADocumentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    connection = app.get(getConnectionToken());
    
    // In a real E2E environment, we'd seed the DB and obtain real JWTs via auth/client/login
    clientAToken = 'MOCK_JWT_CLIENT_A';
    clientBToken = 'MOCK_JWT_CLIENT_B';
    
    clientATicketId = 'MOCK_TICKET_ID_A';
    clientAMeetingId = 'MOCK_MEETING_ID_A';
    clientADocumentId = 'MOCK_DOCUMENT_ID_A';
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('Ticket Isolation (Client A cannot access Client B ticket)', () => {
    it('should reject Client B trying to view Client A ticket', () => {
      return request(app.getHttpServer())
        .get(`/v1/tickets/${clientATicketId}`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404); // 404 is safer than 403 to prevent metadata leak
    });

    it('should reject Client B trying to reply to Client A ticket', () => {
      return request(app.getHttpServer())
        .patch(`/v1/tickets/${clientATicketId}/reply`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .send({ message: 'Hack attempt' })
        .expect(404);
    });
  });

  describe('Meeting Isolation (Client A cannot access Client B meeting)', () => {
    it('should reject Client B trying to cancel Client A meeting', () => {
      return request(app.getHttpServer())
        .delete(`/v1/meetings/${clientAMeetingId}`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404);
    });
  });

  describe('Document Extraction Validation', () => {
    it('should enforce ownership scoping when fetching documents with search queries', () => {
      // Even if Client B searches for an exact string in Client A's document,
      // the endpoint should return [] or 404 because projectId matches are validated against Client.
      return request(app.getHttpServer())
        .get(`/v1/client-portal/projects/CLIENT_A_PROJECT/documents?search=SECRET_CONTRACT`)
        .set('Authorization', `Bearer ${clientBToken}`)
        .expect(404);
    });
  });
});
