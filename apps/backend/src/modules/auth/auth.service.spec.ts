import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getQueueToken } from '@nestjs/bull';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../../database/schemas/user.schema';
import { Client } from '../../database/schemas/client.schema';
import { AuditService } from '../audit/audit.service';
import { SessionService } from './session.service';
import { AuthType, Role } from '@hariventure/types';
import { OtpService } from './otp.service';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockAuditService: any;
  let mockJwtService: any;
  let mockOtpService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
    };

    mockAuditService = {
      logEvent: jest.fn(),
    };

    mockOtpService = {
      generateOtp: jest.fn(),
      verifyOtp: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('temp-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Client.name), useValue: {} },
        { provide: getQueueToken('email'), useValue: { add: jest.fn() } },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: { get: jest.fn(), getOrThrow: jest.fn().mockReturnValue('secret') } },
        { provide: AuditService, useValue: mockAuditService },
        { provide: OtpService, useValue: mockOtpService },
        { provide: SessionService, useValue: { createSession: jest.fn(), revokeSession: jest.fn(), validateAndRotateSession: jest.fn(), revokeAllSessions: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('internalLogin', () => {
    it('should throw Unauthorized on invalid user and log event', async () => {
      mockUserModel.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

      await expect(service.internalLogin({ username: 'test', password: 'pw' }, '127.0.0.1'))
        .rejects.toThrow(UnauthorizedException);

      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_FAILED', metadata: { reason: 'Invalid username', username: 'test' } })
      );
    });

    it('should throw if account is locked out', async () => {
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: '1', role: 'ADMIN', lockoutUntil: new Date(Date.now() + 10000)
        })
      });

      await expect(service.internalLogin({ username: 'test', password: 'pw' }, '127.0.0.1'))
        .rejects.toThrow(ForbiddenException);

      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'LOGIN_FAILED', metadata: { reason: 'Account locked' } })
      );
    });

    it('should increment failed attempts and lockout on 5th failure', async () => {
      const mockUser: any = {
        _id: '1', role: 'ADMIN', internalPasswordHash: 'hash',
        failedLoginAttempts: 4, save: jest.fn()
      };
      mockUserModel.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.internalLogin({ username: 'test', password: 'wrong' }, '127.0.0.1'))
        .rejects.toThrow(UnauthorizedException);

      expect(mockUser.failedLoginAttempts).toBe(5);
      expect(mockUser.lockoutUntil).toBeDefined();
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'ACCOUNT_LOCKED' })
      );
    });

    it('should return tempToken if valid and MFA needed', async () => {
      const mockUser = {
        _id: '1', role: 'ADMIN', internalPasswordHash: 'hash',
        failedLoginAttempts: 2, mfaEnabled: true, save: jest.fn()
      };
      mockUserModel.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.internalLogin({ username: 'test', password: 'correct' }, '127.0.0.1');
      
      expect(mockUser.failedLoginAttempts).toBe(0);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.tempToken).toBe('temp-token');
      expect(result.requiresMfa).toBe(true);
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'ACCOUNT_UNLOCKED' }) // since > 0 failed attempts were reset
      );
    });
  });

  describe('clientLogin (Passwordless)', () => {
    it('should generate OTP and issue tempToken for valid client', async () => {
      const mockUser = {
        _id: 'client1', email: 'client@acme.com', firstName: 'John',
        authType: AuthType.CLIENT, isActive: true, isEmailVerified: true
      };
      mockUserModel.findOne.mockReturnValue(mockUser);
      mockOtpService.generateOtp.mockResolvedValue('123456');

      const result = await service.clientLogin({ email: 'client@acme.com' }, '127.0.0.1');

      expect(mockOtpService.generateOtp).toHaveBeenCalledWith('client@acme.com', 'LOGIN', '127.0.0.1');
      expect(result.requiresOtp).toBe(true);
      expect(result.tempToken).toBe('temp-token');
    });

    it('should throw if email is not verified', async () => {
      mockUserModel.findOne.mockReturnValue({
        isEmailVerified: false
      });

      await expect(service.clientLogin({ email: 'client@acme.com' }, '127.0.0.1'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyClientOtp', () => {
    it('should verify OTP and return tokens', async () => {
      mockJwtService.verify = jest.fn().mockReturnValue({ sub: 'client1', email: 'client@acme.com', purpose: 'OTP_VERIFY' });
      mockOtpService.verifyOtp.mockResolvedValue(true);
      
      const mockUser = {
        _id: 'client1', email: 'client@acme.com', role: Role.CLIENT, authType: AuthType.CLIENT, isActive: true,
      };
      mockUserModel.findOne.mockReturnValue(mockUser);
      mockUserModel.updateOne = jest.fn().mockResolvedValue({});
      
      // Mock issueTokens explicitly since it's an internal method
      jest.spyOn(service as any, 'issueTokens').mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' });

      const result = await service.verifyClientOtp({ otp: '123456' }, 'valid-temp', '127.0.0.1');

      expect(mockOtpService.verifyOtp).toHaveBeenCalledWith('client@acme.com', 'LOGIN', '123456', '127.0.0.1');
      expect(result.tokens.accessToken).toBe('access');
      expect(result.user).toBeDefined();
    });
  });
});
