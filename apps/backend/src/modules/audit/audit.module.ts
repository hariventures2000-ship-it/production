import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../../database/database.module';
import { AuditService } from './audit.service';
import { AuditLog, AuditLogSchema } from '../../database/schemas/audit-log.schema';
import { AuditArchive, AuditArchiveSchema } from '../../database/schemas/audit-archive.schema';
import { AuditChecksum, AuditChecksumSchema } from '../../database/schemas/audit-checksum.schema';
import { AuditRetentionCron } from './audit-retention.cron';
import { AuditIntegrityCron } from './audit-integrity.cron';

@Module({ 
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: AuditArchive.name, schema: AuditArchiveSchema },
      { name: AuditChecksum.name, schema: AuditChecksumSchema },
    ]),
  ], 
  providers: [AuditService, AuditRetentionCron, AuditIntegrityCron],
  exports: [DatabaseModule, AuditService] 
})
export class AuditModule {}
