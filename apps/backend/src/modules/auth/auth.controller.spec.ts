import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RbacGuard } from './guards/rbac.guard';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session.service';

describe('AuthController (Integration)', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Partial<AuthService>>;

  beforeEach(async () => {
    authService = {
      clientLogin: jest.fn(),
      verifyClientOtp: jest.fn(),
      internalLogin: jest.fn(),
      setupMfa: jest.fn(),
      enableMfa: jest.fn(),
      verifyTotp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: SessionService, useValue: { getActiveSessions: jest.fn(), revokeSession: jest.fn() } },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RbacGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('clientLogin', () => {
    it('should set otpTempToken cookie and return masked email', async () => {
      const mockResult = { requiresOtp: true, tempToken: 'mock-temp', maskedEmail: 'c***@test.com' };
      (authService.clientLogin as jest.Mock).mockResolvedValue(mockResult);

      const mockRes = {
        cookie: jest.fn(),
      };

      const result = await controller.clientLogin({ email: 'client@test.com' }, '127.0.0.1', mockRes as any);

      expect(authService.clientLogin).toHaveBeenCalledWith({ email: 'client@test.com' }, '127.0.0.1');
      expect(mockRes.cookie).toHaveBeenCalledWith('otpTempToken', 'mock-temp', expect.any(Object));
      expect(result).toEqual({ requiresOtp: true, maskedEmail: 'c***@test.com' });
    });
  });

  describe('verifyClientOtp', () => {
    it('should throw if no cookie token exists', async () => {
      const mockReq = { cookies: {} };
      const mockRes = { clearCookie: jest.fn(), cookie: jest.fn() };

      await expect(
        controller.verifyClientOtp(mockReq as any, { otp: '123456' }, '127.0.0.1', mockRes as any)
      ).rejects.toThrow('OTP session expired or not found');
    });

    it('should clear temp token, set refresh token cookie, and return access token on success', async () => {
      const mockReq = { cookies: { otpTempToken: 'valid-temp' } };
      const mockRes = { clearCookie: jest.fn(), cookie: jest.fn() };

      (authService.verifyClientOtp as jest.Mock).mockResolvedValue({
        tokens: { accessToken: 'access', refreshToken: 'refresh', expiresIn: 900 },
        user: { id: 1 },
      } as any);

      const result = await controller.verifyClientOtp(mockReq as any, { otp: '123456' }, '127.0.0.1', mockRes as any);

      expect(authService.verifyClientOtp).toHaveBeenCalledWith({ otp: '123456' }, 'valid-temp', '127.0.0.1');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('otpTempToken', { path: '/' });
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'refresh', expect.any(Object));
      expect(result).toEqual({ accessToken: 'access', expiresIn: 900, user: { id: 1 } });
    });
  });
});
