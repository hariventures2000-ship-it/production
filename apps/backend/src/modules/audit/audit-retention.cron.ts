import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';
import { AuditArchive, AuditArchiveDocument } from '../../database/schemas/audit-archive.schema';

@Injectable()
export class AuditRetentionCron {
  private readonly logger = new Logger(AuditRetentionCron.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(AuditArchive.name) private auditArchiveModel: Model<AuditArchiveDocument>,
  ) {}

  // Run every night at 2:00 AM
  @Cron('0 2 * * *')
  async archiveOldLogs() {
    this.logger.log('Starting Audit Log Archive process...');
    
    // Calculate 90 days ago
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    try {
      // Find logs older than 90 days
      const oldLogs = await this.auditLogModel.find({
        createdAt: { $lt: ninetyDaysAgo }
      }).lean();

      if (oldLogs.length > 0) {
        this.logger.log(`Found ${oldLogs.length} audit logs older than 90 days. Moving to archive...`);
        
        // Transform for archive insertion
        const archiveDocs = oldLogs.map(log => ({
          userId: log.userId,
          requestId: (log as any).requestId,
          email: log.email,
          role: log.role,
          action: log.action,
          module: log.module,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          status: log.status,
          changes: log.changes,
          originalCreatedAt: log.createdAt, // Preserve exact timestamp
        }));

        // Insert into archive collection
        await this.auditArchiveModel.insertMany(archiveDocs);
        
        // Delete from hot collection
        const idsToDelete = oldLogs.map(log => log._id);
        await this.auditLogModel.deleteMany({ _id: { $in: idsToDelete } });

        this.logger.log(`Successfully archived and purged ${oldLogs.length} audit logs.`);
      } else {
        this.logger.log('No old audit logs found for archiving.');
      }
    } catch (error) {
      this.logger.error('Failed to execute Audit Log Archive cron', error);
    }
  }
}
