import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SessionService } from './session.service';
import { Session } from '../../database/schemas/session.schema';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';

describe('SessionService', () => {
  let service: SessionService;
  let mockSessionModel: any;
  let mockAuditService: any;

  beforeEach(async () => {
    mockSessionModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      updateMany: jest.fn(),
      find: jest.fn(),
    };
    
    // allow instantiation of the model for save()
    function MockModel(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
    }
    Object.assign(MockModel, mockSessionModel);

    mockAuditService = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: getModelToken(Session.name), useValue: MockModel },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect token reuse and revoke all sessions', async () => {
    const userId = new Types.ObjectId();
    const sessionId = crypto.randomUUID();
    const mockSession = {
      userId,
      sessionId,
      refreshTokenHash: 'hash1',
      expiresAt: new Date(Date.now() + 100000),
      revoked: false,
      save: jest.fn(),
    };

    mockSessionModel.findOne.mockResolvedValue(mockSession);
    mockSessionModel.updateMany.mockResolvedValue({ modifiedCount: 1 });

    // Present an old/incorrect hash
    await expect(
      service.validateAndRotateSession(sessionId, 'old_hash_detected', 'new_hash', {})
    ).rejects.toThrow(UnauthorizedException);

    // Verify it called updateMany to revoke all sessions
    expect(mockSessionModel.updateMany).toHaveBeenCalledWith(
      { userId, revoked: false },
      { revoked: true }
    );
    expect(mockAuditService.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'LOGOUT_ALL_DEVICES' })
    );
    expect(mockAuditService.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'LOGIN_FAILED', metadata: expect.objectContaining({ reason: 'Token reuse detected' }) })
    );
  });
});
