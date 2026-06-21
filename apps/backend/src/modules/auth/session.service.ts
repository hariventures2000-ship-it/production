import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Session, SessionDocument } from '../../database/schemas/session.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>,
    private readonly auditService: AuditService,
  ) {}

  async createSession(
    userId: Types.ObjectId,
    refreshTokenHash: string,
    metadata: { ip?: string; userAgent?: string; device?: string },
    sessionId: string = crypto.randomUUID(),
    expiresInDays = 7,
  ): Promise<SessionDocument> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const session = new this.sessionModel({
      sessionId,
      userId,
      refreshTokenHash,
      ip: metadata.ip || null,
      userAgent: metadata.userAgent || null,
      device: metadata.device || null,
      expiresAt,
      lastUsedAt: new Date(),
    });

    await session.save();

    await this.auditService.logEvent({
      userId,
      action: AuditEvent.SESSION_CREATED,
      module: 'auth',
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      metadata: { sessionId },
    });

    return session;
  }

  async validateAndRotateSession(
    sessionId: string,
    presentedTokenHash: string,
    newHash: string,
    metadata: { ip?: string; userAgent?: string },
  ): Promise<SessionDocument> {
    const session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.expiresAt < new Date()) {
      session.revoked = true;
      await session.save();
      await this.auditService.logEvent({
        userId: session.userId,
        action: AuditEvent.SESSION_EXPIRED,
        module: 'auth',
        ipAddress: metadata.ip,
        userAgent: metadata.userAgent,
        metadata: { sessionId },
      });
      throw new UnauthorizedException('Session expired');
    }

    const tokenValid = await bcrypt.compare(presentedTokenHash, session.refreshTokenHash);

    if (session.revoked || !tokenValid) {
      // REUSE DETECTION / BREACHED SESSION
      this.logger.warn(`Token reuse or revoked session access detected for user ${session.userId}, session ${sessionId}`);
      
      // Revoke all sessions for this user immediately
      await this.revokeAllSessions(session.userId, metadata);
      
      await this.auditService.logEvent({
        userId: session.userId,
        action: AuditEvent.LOGIN_FAILED,
        status: 'FAILURE',
        module: 'auth',
        ipAddress: metadata.ip,
        userAgent: metadata.userAgent,
        metadata: { reason: 'Token reuse detected', sessionId },
      });

      throw new UnauthorizedException('Security breach detected. All sessions revoked. Please log in again.');
    }

    // Valid rotation - Atomic update to prevent concurrent refresh attacks
    const updated = await this.sessionModel.findOneAndUpdate(
      { sessionId, __v: session.__v },
      { 
        $set: { 
          refreshTokenHash: newHash, 
          lastUsedAt: new Date(), 
          ...(metadata.ip && { ip: metadata.ip }), 
          ...(metadata.userAgent && { userAgent: metadata.userAgent }) 
        },
        $inc: { __v: 1 }
      },
      { new: true }
    );

    if (!updated) {
      // Concurrent refresh detected
      this.logger.warn(`Concurrent refresh attack detected for user ${session.userId}, session ${sessionId}`);
      await this.revokeAllSessions(session.userId, metadata);
      await this.auditService.logEvent({
        userId: session.userId,
        action: AuditEvent.LOGIN_FAILED,
        status: 'FAILURE',
        module: 'auth',
        ipAddress: metadata.ip,
        userAgent: metadata.userAgent,
        metadata: { reason: 'Concurrent refresh attack detected', sessionId },
      });
      throw new UnauthorizedException('Security breach detected. All sessions revoked.');
    }

    await this.auditService.logEvent({
      userId: session.userId,
      action: AuditEvent.TOKEN_REFRESH,
      module: 'auth',
      ipAddress: metadata.ip,
      userAgent: metadata.userAgent,
      metadata: { sessionId },
    });

    return session;
  }

  async revokeSession(sessionId: string, userId: Types.ObjectId, metadata?: { ip?: string; userAgent?: string }): Promise<void> {
    const session = await this.sessionModel.findOneAndUpdate(
      { sessionId, userId },
      { revoked: true }
    );

    if (session) {
      await this.auditService.logEvent({
        userId,
        action: AuditEvent.SESSION_REVOKED,
        module: 'auth',
        ipAddress: metadata?.ip,
        userAgent: metadata?.userAgent,
        metadata: { sessionId },
      });
    }
  }

  async revokeAllSessions(userId: Types.ObjectId, metadata?: { ip?: string; userAgent?: string }): Promise<void> {
    await this.sessionModel.updateMany({ userId, revoked: false }, { revoked: true });
    
    await this.auditService.logEvent({
      userId,
      action: AuditEvent.LOGOUT_ALL_DEVICES,
      module: 'auth',
      ipAddress: metadata?.ip,
      userAgent: metadata?.userAgent,
    });
  }

  async getActiveSessions(userId: Types.ObjectId | string): Promise<SessionDocument[]> {
    const objId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const sessions = await this.sessionModel.find({
      userId: objId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).select('-refreshTokenHash').exec();
    console.log(`[getActiveSessions] userId=${userId}, objId=${objId}, found=${sessions.length}`);
    return sessions;
  }
}
