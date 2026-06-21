import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { OtpAttempt, OtpAttemptDocument } from '../../database/schemas/otp-attempt.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(OtpAttempt.name) private readonly otpModel: Model<OtpAttemptDocument>,
    private readonly auditService: AuditService,
  ) {}

  async generateOtp(email: string, purpose: string, ip: string): Promise<string> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    // Rate Limiting: Max 5 per hour
    const recentOtps = await this.otpModel.countDocuments({
      email,
      purpose,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentOtps >= 5) {
      await this.auditService.logEvent({
        email,
        action: AuditEvent.OTP_FAILED,
        module: 'auth',
        ipAddress: ip,
        status: 'FAILURE',
        metadata: { reason: 'Rate limit exceeded: > 5 OTPs per hour' },
      });
      throw new HttpException('Too many OTP requests. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Cooldown Logic: 60 seconds
    const latestOtp = await this.otpModel.findOne({ email, purpose }).sort({ createdAt: -1 });
    if (latestOtp && latestOtp.createdAt && latestOtp.createdAt > oneMinuteAgo) {
      throw new HttpException('Please wait 60 seconds before requesting another OTP.', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Generate 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    const otpRecord = new this.otpModel({
      email,
      purpose,
      otpHash,
      expiresAt,
    });

    await otpRecord.save();

    await this.auditService.logEvent({
      email,
      action: AuditEvent.OTP_SENT,
      module: 'auth',
      ipAddress: ip,
      metadata: { purpose },
    });

    return otp; // Returning plaintext OTP so the mailer can send it. Never log this.
  }

  async verifyOtp(email: string, purpose: string, otp: string, ip: string): Promise<boolean> {
    const latestOtp = await this.otpModel.findOne({ 
      email, 
      purpose,
      expiresAt: { $gt: new Date() },
      verified: false
    }).sort({ createdAt: -1 });

    if (!latestOtp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (latestOtp.attempts >= 5) {
      await this.auditService.logEvent({
        email,
        action: AuditEvent.OTP_FAILED,
        module: 'auth',
        ipAddress: ip,
        status: 'FAILURE',
        metadata: { reason: 'Max verification attempts reached' },
      });
      throw new UnauthorizedException('Maximum verification attempts reached. Request a new OTP.');
    }

    const providedHash = crypto.createHash('sha256').update(otp).digest('hex');

    console.log(`[DEV DEBUG] OTP provided: '${otp}'`);
    console.log(`[DEV DEBUG] Provided Hash: ${providedHash}`);
    console.log(`[DEV DEBUG] Stored Hash: ${latestOtp.otpHash}`);

    if (providedHash !== latestOtp.otpHash) {
      latestOtp.attempts += 1;
      await latestOtp.save();

      await this.auditService.logEvent({
        email,
        action: AuditEvent.OTP_FAILED,
        module: 'auth',
        ipAddress: ip,
        status: 'FAILURE',
        metadata: { reason: 'Invalid OTP provided', attempts: latestOtp.attempts },
      });

      throw new UnauthorizedException('Invalid OTP');
    }

    // Success
    latestOtp.verified = true;
    latestOtp.attempts += 1;
    await latestOtp.save();

    await this.auditService.logEvent({
      email,
      action: AuditEvent.OTP_VERIFIED,
      module: 'auth',
      ipAddress: ip,
      metadata: { purpose },
    });

    return true;
  }
}
