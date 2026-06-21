import {
  Injectable, BadRequestException, UnauthorizedException,
  ConflictException, NotFoundException, InternalServerErrorException,
  ForbiddenException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import * as CryptoJS from 'crypto-js';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { Role, AuthType, JwtPayload, TokenPair } from '@hariventure/types';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';
import { OtpService } from './otp.service';
import { SessionService } from './session.service';
import {
  ClientRegisterDto, ClientLoginDto, VerifyClientOtpDto,
  InternalLoginDto, VerifyTotpDto, EnableMfaDto, UseBackupCodeDto,
  ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto,
} from './dto/auth.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly mfaEncryptionKey: string;
  private readonly mfaIssuer: string;
  private readonly otpTtl: number;
  private readonly otpLength: number;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly auditService: AuditService,
    private readonly otpService: OtpService,
    private readonly sessionService: SessionService,
  ) {
    this.mfaEncryptionKey = config.getOrThrow<string>('MFA_ENCRYPTION_KEY');
    this.mfaIssuer = config.get<string>('MFA_ISSUER', 'Hariventure');
    this.otpTtl = config.get<number>('OTP_TTL_SECONDS', 300);
    this.otpLength = config.get<number>('OTP_LENGTH', 6);
  }

  // ═══════════════════════════════════════════════════════════════════
  // CLIENT AUTH FLOWS
  // ═══════════════════════════════════════════════════════════════════

  async clientRegister(dto: ClientRegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const emailVerifyToken = this.jwtService.sign(
      { email: dto.email, purpose: 'EMAIL_VERIFY' },
      {
        secret: this.config.getOrThrow('JWT_EMAIL_VERIFY_SECRET'),
        expiresIn: this.config.get('JWT_EMAIL_VERIFY_EXPIRES_IN', '24h'),
      },
    );

    const user = await this.userModel.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash,
      role: Role.CLIENT,
      authType: AuthType.CLIENT,
      isEmailVerified: false,
      emailVerifyToken,
      emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Create client profile
    await this.clientModel.create({
      userId: user._id,
      companyName: dto.companyName || `${dto.firstName}'s Company`,
      contactEmail: dto.email.toLowerCase(),
    });

    // Queue verification email
    await this.emailQueue.add('send-verification-email', {
      to: dto.email,
      name: dto.firstName,
      token: emailVerifyToken,
    });

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      email: this.maskEmail(dto.email),
    };
  }

  async verifyEmail(token: string) {
    let payload: { email: string; purpose: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: this.config.getOrThrow('JWT_EMAIL_VERIFY_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired verification link');
    }

    if (payload.purpose !== 'EMAIL_VERIFY') {
      throw new BadRequestException('Invalid token purpose');
    }

    const user = await this.userModel.findOne({ email: payload.email });
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified) {
      return { message: 'Email already verified. You can log in.' };
    }

    await this.userModel.updateOne(
      { _id: user._id },
      { isEmailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
    );

    return { message: 'Email verified successfully. You can now log in.' };
  }

  async clientLogin(dto: ClientLoginDto, ip: string) {
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase(), authType: AuthType.CLIENT, isActive: true });

    if (!user) throw new UnauthorizedException('Invalid email or user not found');
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Generate robust OTP using OtpService (Rate Limited + Cooldown)
    const otp = await this.otpService.generateOtp(user.email, 'LOGIN', ip);

    // Queue OTP email
    await this.emailQueue.add('send-otp-email', {
      to: user.email,
      name: user.firstName,
      otp,
      expiresInMinutes: 5,
    });

    // Issue temp token for OTP step
    const tempToken = this.jwtService.sign(
      { sub: String(user._id), email: user.email, purpose: 'OTP_VERIFY' },
      { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '5m' },
    );

    return {
      requiresOtp: true,
      tempToken,
      maskedEmail: this.maskEmail(user.email),
    };
  }

  async verifyClientOtp(dto: VerifyClientOtpDto, tempToken: string, ip: string): Promise<{ tokens: TokenPair; user: object }> {
    let payload: { sub: string; email: string; purpose: string };
    try {
      payload = this.jwtService.verify(tempToken, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('OTP session expired. Please login again.');
    }

    if (payload.purpose !== 'OTP_VERIFY' || !payload.email) {
      throw new BadRequestException('Invalid token purpose');
    }

    // Verifies OTP utilizing OtpService strict locking limits
    await this.otpService.verifyOtp(payload.email, 'LOGIN', dto.otp, ip);

    const user = await this.userModel
      .findOne({ _id: payload.sub, isActive: true });

    if (!user) throw new UnauthorizedException('User not found');

    await this.userModel.updateOne({ _id: user._id }, { lastLoginAt: new Date() } as any);

    await this.auditService.logEvent({
      userId: user._id,
      email: user.email,
      role: user.role,
      action: AuditEvent.LOGIN_SUCCESS,
      module: 'auth',
      ipAddress: ip,
      metadata: { authType: user.authType }
    });

    const tokens = await this.issueTokens(String(user._id), user.role, user.authType, ip);
    return { tokens, user: this.sanitizeUser(user) };
  }

  // ═══════════════════════════════════════════════════════════════════
  // INTERNAL USER AUTH FLOWS
  // ═══════════════════════════════════════════════════════════════════

  async internalLogin(dto: InternalLoginDto, ip?: string, userAgent?: string) {
    if (!dto.username && !dto.email) {
      throw new UnauthorizedException('Either username or email must be provided');
    }

    const query: any = { authType: AuthType.INTERNAL, isActive: true };
    if (dto.username) {
      query.username = dto.username.toLowerCase();
    } else if (dto.email) {
      query.email = dto.email.toLowerCase();
    }

    const user = await this.userModel
      .findOne(query)
      .select('+internalPasswordHash +mfaEnabled +mfaSecret +failedLoginAttempts +lockoutUntil +lastFailedLoginAt');

    if (!user) {
      await this.auditService.logEvent({
        action: AuditEvent.LOGIN_FAILED,
        module: 'auth',
        ipAddress: ip,
        userAgent,
        status: 'FAILURE',
        metadata: { reason: 'Invalid username', username: dto.username },
      });
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      await this.auditService.logEvent({
        userId: user._id,
        role: user.role,
        action: AuditEvent.LOGIN_FAILED,
        module: 'auth',
        ipAddress: ip,
        userAgent,
        status: 'FAILURE',
        metadata: { reason: 'Account locked' },
      });
      throw new ForbiddenException('Account is temporarily locked. Please try again later.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.internalPasswordHash);
    
    if (!passwordValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.lastFailedLoginAt = new Date();

      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await user.save();
        
        await this.auditService.logEvent({
          userId: user._id,
          role: user.role,
          action: AuditEvent.ACCOUNT_LOCKED,
          module: 'auth',
          ipAddress: ip,
          userAgent,
          metadata: { reason: 'Too many failed login attempts' },
        });
      } else {
        await user.save();
      }

      await this.auditService.logEvent({
        userId: user._id,
        role: user.role,
        action: AuditEvent.LOGIN_FAILED,
        module: 'auth',
        ipAddress: ip,
        userAgent,
        status: 'FAILURE',
        metadata: { reason: 'Invalid password', attempts: user.failedLoginAttempts },
      });

      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockoutUntil = undefined;
      user.lastFailedLoginAt = undefined;
      await user.save();
      
      await this.auditService.logEvent({
        userId: user._id,
        role: user.role,
        action: AuditEvent.ACCOUNT_UNLOCKED,
        module: 'auth',
        ipAddress: ip,
        userAgent,
        metadata: { reason: 'Successful login resets lockout' },
      });
    }

    if (!user.mfaEnabled) {
      const tempToken = this.jwtService.sign(
        { sub: String(user._id), purpose: 'MFA_SETUP' },
        { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '10m' },
      );
      return { requiresMfa: true, requiresMfaSetup: true, tempToken };
    }

    const tempToken = this.jwtService.sign(
      { sub: String(user._id), purpose: 'MFA_VERIFY' },
      { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '5m' },
    );
    return { requiresMfa: true, requiresMfaSetup: false, tempToken };
  }

  async setupMfa(tempToken: string) {
    const payload = this.verifyTempToken(tempToken, 'MFA_SETUP');
    const user = await this.userModel.findOne({ _id: payload.sub, isActive: true });
    if (!user) throw new NotFoundException('User not found');

    // Generate TOTP secret
    const secret = authenticator.generateSecret();
    const encryptedSecret = CryptoJS.AES.encrypt(secret, this.mfaEncryptionKey).toString();

    // Save encrypted secret (not yet enabled)
    await this.userModel.updateOne({ _id: user._id }, { mfaSecret: encryptedSecret } as any);

    // Generate QR code
    const otpauthUrl = authenticator.keyuri(
      user.username || String(user._id),
      this.mfaIssuer,
      secret,
    );
    const qrCodeImage = await qrcode.toDataURL(otpauthUrl);

    // New temp token for enable step
    const setupTempToken = this.jwtService.sign(
      { sub: String(user._id), purpose: 'MFA_SETUP' },
      { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '10m' },
    );

    return {
      qrCodeUri: otpauthUrl,
      qrCodeImage,
      manualEntryKey: secret, // Show base32 key for manual entry
      tempToken: setupTempToken,
      instructions: `Scan the QR code with Microsoft Authenticator, then enter the 6-digit code to confirm.`,
    };
  }

  async enableMfa(dto: EnableMfaDto, tempToken: string): Promise<{ enabled: true; backupCodes: string[] }> {
    const payload = this.verifyTempToken(tempToken, 'MFA_SETUP');
    const user = await this.userModel
      .findOne({ _id: payload.sub, isActive: true })
      .select('+mfaSecret');
    if (!user) throw new NotFoundException('User not found');
    if (!user.mfaSecret) throw new BadRequestException('MFA setup not initiated');

    const secret = this.decryptMfaSecret(user.mfaSecret);
    const isValid = authenticator.verify({ token: dto.totpCode, secret });
    if (!isValid) throw new UnauthorizedException('Invalid TOTP code. Please try again.');

    // Generate backup codes
    const plainCodes = Array.from({ length: 10 }, () => nanoid(12).toUpperCase());
    const hashedCodes = await Promise.all(plainCodes.map((c) => bcrypt.hash(c, 8)));

    await this.userModel.updateOne(
      { _id: user._id },
      { mfaEnabled: true, mfaBackupCodes: hashedCodes, mfaEnabledAt: new Date() } as any,
    );

    return { enabled: true, backupCodes: plainCodes }; // Shown ONCE
  }

  async verifyTotp(dto: VerifyTotpDto, tempToken: string): Promise<{ tokens: TokenPair; user: object }> {
    const payload = this.verifyTempToken(tempToken, 'MFA_VERIFY');
    const user = await this.userModel
      .findOne({ _id: payload.sub, isActive: true })
      .select('+mfaSecret');
    if (!user) throw new NotFoundException('User not found');
    if (!user.mfaEnabled || !user.mfaSecret) {
      throw new BadRequestException('MFA not enabled for this account');
    }

    const secret = this.decryptMfaSecret(user.mfaSecret);
    const isValid = authenticator.verify({ token: dto.totpCode, secret });
    if (!isValid) throw new UnauthorizedException('Invalid TOTP code. It may have expired.');

    await this.userModel.updateOne({ _id: user._id }, { lastLoginAt: new Date() } as any);

    await this.auditService.logEvent({
      userId: user._id,
      role: user.role,
      action: AuditEvent.LOGIN_SUCCESS,
      module: 'auth',
      metadata: { authType: user.authType, method: 'TOTP' }
    });

    const tokens = await this.issueTokens(String(user._id), user.role, user.authType, undefined, undefined);
    return { tokens, user: this.sanitizeUser(user) };
  }

  async useBackupCode(dto: UseBackupCodeDto): Promise<{ tokens: TokenPair; user: object }> {
    const payload = this.verifyTempToken(dto.tempToken, 'MFA_VERIFY');
    const user = await this.userModel
      .findOne({ _id: payload.sub, isActive: true })
      .select('+mfaBackupCodes');
    if (!user) throw new NotFoundException('User not found');

    const normalizedCode = dto.backupCode.replace(/-/g, '').toUpperCase();
    let usedIndex = -1;

    for (let i = 0; i < user.mfaBackupCodes.length; i++) {
      const match = await bcrypt.compare(normalizedCode, user.mfaBackupCodes[i]);
      if (match) { usedIndex = i; break; }
    }

    if (usedIndex === -1) throw new UnauthorizedException('Invalid backup code');

    // Remove used backup code
    const updatedCodes = [...user.mfaBackupCodes];
    updatedCodes.splice(usedIndex, 1);
    await this.userModel.updateOne(
      { _id: user._id },
      { mfaBackupCodes: updatedCodes, lastLogin: new Date() } as any,
    );

    const tokens = await this.issueTokens(String(user._id), user.role, user.authType, undefined, undefined);
    return {
      tokens,
      user: this.sanitizeUser(user),
      // Warn user they have X codes remaining
      backupCodesRemaining: updatedCodes.length,
    } as any;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SHARED FLOWS
  // ═══════════════════════════════════════════════════════════════════

  async refreshTokens(refreshToken: string, ip?: string, userAgent?: string): Promise<TokenPair & { routeSessionToken: string }> {
    let payload: { sub: string; sessionId?: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userModel
      .findOne({ _id: payload.sub, isActive: true })
      .select('+tokenVersion');
    if (!user) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }

    const sha256Token = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const sessionId = payload.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Legacy refresh tokens are no longer supported. Please log in again.');
    }

    const newSessionId = sessionId;
    const tokenVersion = user.tokenVersion || 0;
    const newPayload: JwtPayload = { sub: String(user._id), role: user.role, authType: user.authType, tokenVersion };

    const [accessToken, newRefreshToken, routeSessionToken] = await Promise.all([
      this.jwtService.signAsync(newPayload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: String(user._id), sessionId: newSessionId },
        {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
      this.jwtService.signAsync(
        { sub: String(user._id), role: user.role, authType: user.authType, tokenVersion },
        { secret: this.config.getOrThrow('JWT_ROUTE_SESSION_SECRET'), expiresIn: '5m' }
      )
    ]);

    const newSha256Token = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const newRefreshTokenHash = await bcrypt.hash(newSha256Token, 8);

    await this.sessionService.validateAndRotateSession(
      sessionId,
      sha256Token,
      newRefreshTokenHash,
      { ip, userAgent }
    );
    

    return { accessToken, refreshToken: newRefreshToken, routeSessionToken, expiresIn: 15 * 60 };
  }

  async logout(userId: string, sessionId?: string, ip?: string, userAgent?: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new NotFoundException('User not found');
    if (sessionId) {
      await this.sessionService.revokeSession(sessionId, user._id, { ip, userAgent });
    }

    if (user) {
      await this.auditService.logEvent({
        userId: user._id,
        role: user.role,
        action: AuditEvent.LOGOUT,
        module: 'auth',
        ipAddress: ip,
        userAgent,
      });
    }
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string, ip?: string, userAgent?: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new NotFoundException('User not found');
    await this.sessionService.revokeAllSessions(user._id, { ip, userAgent });
    await this.userModel.updateOne({ _id: userId }, { 

      $inc: { tokenVersion: 1 } 
    });
    if (user) {
      await this.auditService.logEvent({
        userId: user._id,
        role: user.role,
        action: AuditEvent.LOGOUT,
        module: 'auth',
        ipAddress: ip,
        userAgent,
        metadata: { type: 'LOGOUT_ALL' }
      });
    }
    return { message: 'Logged out from all devices successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      $or: [{ email: dto.identifier }, { username: dto.identifier }],
      isActive: true,
    });

    // Always return success to prevent user enumeration
    if (!user) return { message: 'If that account exists, a reset link has been sent.' };

    const resetToken = this.jwtService.sign(
      { sub: String(user._id), purpose: 'PASSWORD_RESET' },
      {
        secret: this.config.getOrThrow('JWT_PASSWORD_RESET_SECRET'),
        expiresIn: this.config.get('JWT_PASSWORD_RESET_EXPIRES_IN', '1h'),
      },
    );

    await this.userModel.updateOne(
      { _id: user._id },
      { passwordResetToken: resetToken, passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000) },
    );

    await this.emailQueue.add('send-password-reset-email', {
      to: user.email || `${user.username}@hariventure.com`,
      name: user.firstName,
      token: resetToken,
      authType: user.authType,
    });

    return { message: 'If that account exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(dto.token, {
        secret: this.config.getOrThrow('JWT_PASSWORD_RESET_SECRET'),
      });
    } catch {
      throw new BadRequestException('Invalid or expired reset link');
    }
    if (payload.purpose !== 'PASSWORD_RESET') throw new BadRequestException('Invalid token');

    const user = await this.userModel.findOne({ _id: payload.sub, isActive: true });
    if (!user) throw new NotFoundException('User not found');
    if (!user.passwordResetToken) throw new BadRequestException('Reset link already used');

    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    const updateField = user.authType === AuthType.CLIENT ? 'passwordHash' : 'internalPasswordHash';

    await this.userModel.updateOne(
      { _id: user._id },
      { [updateField]: newHash, passwordResetToken: null, passwordResetExpiry: null },
    );

    return { message: 'Password reset successfully. Please log in.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel
      .findOne({ _id: userId })
      .select('+passwordHash +internalPasswordHash');
    if (!user) throw new NotFoundException('User not found');

    const currentHash = user.authType === AuthType.CLIENT
      ? user.passwordHash
      : user.internalPasswordHash;

    const passwordValid = await bcrypt.compare(dto.currentPassword, currentHash);
    if (!passwordValid) throw new UnauthorizedException('Current password is incorrect');

    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    const updateField = user.authType === AuthType.CLIENT ? 'passwordHash' : 'internalPasswordHash';

    await this.userModel.updateOne({ _id: userId }, { [updateField]: newHash });
    
    await this.auditService.logEvent({
      userId: user._id,
      email: user.email,
      role: user.role,
      action: AuditEvent.PASSWORD_CHANGED,
      module: 'auth',
    });
    
    return { message: 'Password changed successfully. Please log in again.' };
  }

  async firstLoginPasswordChange(userId: string, newPassword: string, ip?: string) {
    const user = await this.userModel.findOne({ _id: userId, authType: AuthType.CLIENT });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isFirstLogin) throw new BadRequestException('Not your first login');

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await this.userModel.updateOne(
      { _id: userId },
      { 
        passwordHash: newHash,
        isFirstLogin: false,
        lastPasswordChangeAt: new Date()
      }
    );

    await this.auditService.logEvent({
      userId: user._id,
      email: user.email,
      role: user.role,
      action: AuditEvent.CLIENT_PASSWORD_CHANGED,
      module: 'auth',
      ipAddress: ip,
    });

    return { message: 'Password updated successfully. You can now access the dashboard.' };
  }

  async adminResetMfa(adminUserId: string, targetUserId: string) {
    const admin = await this.userModel.findOne({ _id: adminUserId });
    if (!admin || admin.role !== Role.CEO) {
      throw new ForbiddenException('Only CEO can reset MFA for other users');
    }

    const target = await this.userModel.findOne({ _id: targetUserId });
    if (!target) throw new NotFoundException('Target user not found');
    if (target.authType !== AuthType.INTERNAL) {
      throw new BadRequestException('MFA reset only applies to internal users');
    }

    await this.userModel.updateOne(
      { _id: targetUserId },
      { mfaEnabled: false, mfaSecret: null, mfaBackupCodes: [], mfaEnabledAt: null } as any,
    );

    return { message: `MFA reset for ${target.firstName} ${target.lastName}. They will be required to set up MFA on next login.` };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findOne({ _id: userId, isActive: true });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  // ═══════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════

  private async issueTokens(userId: string, role: Role, authType: AuthType, ip?: string, userAgent?: string): Promise<TokenPair & { routeSessionToken: string }> {
    const user = await this.userModel.findOne({ _id: userId }).select('+tokenVersion');
    if (!user) throw new NotFoundException('User not found');
    const tokenVersion = user.tokenVersion || 0;
    const isFirstLogin = user.isFirstLogin || false;
    const sessionId = crypto.randomUUID();

    const payload: JwtPayload = { sub: userId, role, authType, tokenVersion, isFirstLogin };

    const [accessToken, refreshToken, routeSessionToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(
        { sub: userId, sessionId },
        {
          secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role, authType, tokenVersion, isFirstLogin },
        {
          secret: this.config.getOrThrow('JWT_ROUTE_SESSION_SECRET'),
          expiresIn: '5m',
        },
      )
    ]);

    const sha256Token = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshTokenHash = await bcrypt.hash(sha256Token, 8);
    
    await this.sessionService.createSession(
      user._id,
      refreshTokenHash,
      { ip, userAgent },
      sessionId,
      7
    );


    return { accessToken, refreshToken, routeSessionToken, expiresIn: 15 * 60 };
  }

  private verifyTempToken(token: string, expectedPurpose: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; purpose: string }>(token, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      });
      if (payload.purpose !== expectedPurpose) {
        throw new BadRequestException('Invalid token purpose');
      }
      return payload;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new UnauthorizedException('Session expired. Please start over.');
    }
  }

  private generateOtp(): string {
    return Math.floor(Math.random() * Math.pow(10, this.otpLength))
      .toString()
      .padStart(this.otpLength, '0');
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    return `${local[0]}${'*'.repeat(Math.max(local.length - 2, 2))}${local.slice(-1)}@${domain}`;
  }

  private decryptMfaSecret(encryptedSecret: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedSecret, this.mfaEncryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private sanitizeUser(user: UserDocument) {
    const obj = user.toObject ? user.toObject() : user;
    const {
      passwordHash, internalPasswordHash,
      mfaSecret, mfaBackupCodes, emailVerifyToken, ...safe
    } = obj as any;
    return safe;
  }
}
