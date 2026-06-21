import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpAttempt } from '../../database/schemas/otp-attempt.schema';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';

describe('OtpService', () => {
  let service: OtpService;
  let mockOtpModel: any;
  let mockAuditService: any;

  beforeEach(async () => {
    mockOtpModel = {
      countDocuments: jest.fn(),
      findOne: jest.fn(),
    };

    function MockModel(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
    }
    Object.assign(MockModel, mockOtpModel);

    mockAuditService = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        { provide: getModelToken(OtpAttempt.name), useValue: MockModel },
        { provide: AuditService, useValue: mockAuditService },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateOtp', () => {
    it('should throw if > 5 OTPs generated in last hour', async () => {
      mockOtpModel.countDocuments.mockResolvedValue(5);
      
      await expect(service.generateOtp('test@test.com', 'LOGIN', '127.0.0.1'))
        .rejects.toThrow(HttpException);
      
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'OTP_FAILED', metadata: { reason: 'Rate limit exceeded: > 5 OTPs per hour' } })
      );
    });

    it('should throw if cooldown (60s) active', async () => {
      mockOtpModel.countDocuments.mockResolvedValue(2);
      mockOtpModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({ createdAt: new Date(Date.now() - 30000) }) // 30s ago
      });

      await expect(service.generateOtp('test@test.com', 'LOGIN', '127.0.0.1'))
        .rejects.toThrow(HttpException);
    });

    it('should generate OTP successfully', async () => {
      mockOtpModel.countDocuments.mockResolvedValue(0);
      mockOtpModel.findOne.mockReturnValue({ sort: jest.fn().mockResolvedValue(null) });

      const otp = await service.generateOtp('test@test.com', 'LOGIN', '127.0.0.1');
      expect(otp).toBeDefined();
      expect(otp.length).toBe(6);
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'OTP_SENT' })
      );
    });
  });

  describe('verifyOtp', () => {
    it('should throw UnauthorizedException if attempts >= 5', async () => {
      mockOtpModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({ attempts: 5, verified: false, save: jest.fn() })
      });

      await expect(service.verifyOtp('test@test.com', 'LOGIN', '123456', '127.0.0.1'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should increment attempts on failure', async () => {
      const mockRecord = { attempts: 0, verified: false, otpHash: 'wronghash', save: jest.fn() };
      mockOtpModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRecord)
      });

      await expect(service.verifyOtp('test@test.com', 'LOGIN', '123456', '127.0.0.1'))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockRecord.attempts).toBe(1);
      expect(mockRecord.save).toHaveBeenCalled();
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'OTP_FAILED', metadata: expect.objectContaining({ reason: 'Invalid OTP provided' }) })
      );
    });

    it('should succeed with valid OTP', async () => {
      const validOtp = '123456';
      const validHash = crypto.createHash('sha256').update(validOtp).digest('hex');
      const mockRecord = { attempts: 0, verified: false, otpHash: validHash, save: jest.fn() };
      
      mockOtpModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockRecord)
      });

      const result = await service.verifyOtp('test@test.com', 'LOGIN', validOtp, '127.0.0.1');
      expect(result).toBe(true);
      expect(mockRecord.verified).toBe(true);
      expect(mockRecord.attempts).toBe(1);
      expect(mockRecord.save).toHaveBeenCalled();
    });
  });
});
