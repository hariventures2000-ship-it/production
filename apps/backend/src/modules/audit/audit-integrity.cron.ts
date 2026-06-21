import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';
import { AuditChecksum, AuditChecksumDocument } from '../../database/schemas/audit-checksum.schema';
import * as crypto from 'crypto';

@Injectable()
export class AuditIntegrityCron {
  private readonly logger = new Logger(AuditIntegrityCron.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(AuditChecksum.name) private checksumModel: Model<AuditChecksumDocument>,
  ) {}

  // Run daily at 01:00 AM to seal yesterday's logs
  @Cron('0 1 * * *')
  async generateDailyChecksum() {
    this.logger.log('Starting Audit Integrity Verification...');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Normalize to YYYY-MM-DD
    const dateStr = yesterday.toISOString().split('T')[0];
    
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    try {
      const logs = await this.auditLogModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }).sort({ createdAt: 1 }).lean();

      if (logs.length > 0) {
        // Create deterministic string representation of all logs
        const payloadStr = logs.map(l => 
          `${l._id}-${l.action}-${l.userId || 'system'}-${new Date(l.createdAt).getTime()}`
        ).join('|');

        // Generate SHA-256 Hash
        const hash = crypto.createHash('sha256').update(payloadStr).digest('hex');

        // Store Checksum
        await this.checksumModel.findOneAndUpdate(
          { date: dateStr },
          { hash, recordCount: logs.length, verifiedAt: new Date() },
          { upsert: true }
        );

        this.logger.log(`Audit Integrity Hash generated for ${dateStr} (${logs.length} records) - Hash: ${hash.substring(0, 8)}...`);
      } else {
        this.logger.log(`No audit logs found for ${dateStr}. Checksum skipped.`);
      }
    } catch (error) {
      this.logger.error('Failed to execute Audit Integrity Checksum generation', error);
    }
  }
}
