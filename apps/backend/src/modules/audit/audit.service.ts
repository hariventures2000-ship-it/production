import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';
import { AuditEvent } from './enums/audit-event.enum';
import { requestContext } from '../../common/utils/request-context';

export interface CreateAuditLogDto {
  userId?: Types.ObjectId | string;
  email?: string;
  role?: string;
  action: AuditEvent | string;
  module: string;
  ipAddress?: string;
  userAgent?: string;
  status?: 'SUCCESS' | 'FAILURE';
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  async logEvent(dto: CreateAuditLogDto): Promise<void> {
    try {
      const sanitizedMetadata = this.sanitizeMetadata(dto.metadata);
      
      const store = requestContext.getStore();
      const requestId = store?.get('requestId') || null;

      const logEntry = new this.auditLogModel({
        userId: dto.userId ? new Types.ObjectId(dto.userId) : null,
        requestId,
        email: dto.email || null,
        role: dto.role || null,
        action: dto.action,
        module: dto.module,
        ipAddress: dto.ipAddress || null,
        userAgent: dto.userAgent || null,
        status: dto.status || 'SUCCESS',
        changes: sanitizedMetadata ? { after: sanitizedMetadata } : null,
      });

      await logEntry.save();
    } catch (error) {
      // We don't want audit failures to crash the application flow, but we must log them
      this.logger.error(`Failed to create audit log for action ${dto.action}`, error instanceof Error ? error.stack : 'Unknown error');
    }
  }

  private sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!metadata) return undefined;
    
    const sanitized = { ...metadata };
    const sensitiveKeys = ['password', 'hash', 'token', 'secret', 'otp', 'mfa', 'totp', 'refreshToken'];
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
}
