import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsCacheService } from './analytics-cache.service';
import { RiskEngineService } from './risk-engine.service';

import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { Project, ProjectSchema } from '../../database/schemas/project.schema';
import { ProjectMilestone, ProjectMilestoneSchema } from '../../database/schemas/project-milestone.schema';
import { Invoice, InvoiceSchema } from '../../database/schemas/invoice.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { SupportTicket, SupportTicketSchema } from '../../database/schemas/support-ticket.schema';
import { Meeting, MeetingSchema } from '../../database/schemas/meeting.schema';
import { AuditLog, AuditLogSchema } from '../../database/schemas/audit-log.schema';
import { AnalyticsSnapshot, AnalyticsSnapshotSchema } from '../../database/schemas/analytics-snapshot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectMilestone.name, schema: ProjectMilestoneSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema },
      { name: Meeting.name, schema: MeetingSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: AnalyticsSnapshot.name, schema: AnalyticsSnapshotSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsCacheService, RiskEngineService],
  exports: [AnalyticsCacheService],
})
export class AnalyticsModule {}
