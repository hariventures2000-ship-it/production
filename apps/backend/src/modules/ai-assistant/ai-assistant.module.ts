import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAssistantService } from './ai-assistant.service';
import { AiAssistantController } from './ai-assistant.controller';
import { WeeklyReportCron } from './weekly-report.cron';
import { Project, ProjectSchema } from '../../database/schemas/project.schema';
import { ProjectMilestone, ProjectMilestoneSchema } from '../../database/schemas/project-milestone.schema';
import { ProjectUpdate, ProjectUpdateSchema } from '../../database/schemas/project-update.schema';
import { DocumentFile as AppDocument, DocumentFileSchema as DocumentSchema } from '../../database/schemas/document.schema';
import { Invoice, InvoiceSchema } from '../../database/schemas/invoice.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { SupportTicket, SupportTicketSchema } from '../../database/schemas/support-ticket.schema';
import { Meeting, MeetingSchema } from '../../database/schemas/meeting.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectMilestone.name, schema: ProjectMilestoneSchema },
      { name: ProjectUpdate.name, schema: ProjectUpdateSchema },
      { name: AppDocument.name, schema: DocumentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema },
      { name: Meeting.name, schema: MeetingSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    AuditModule,
  ],
  controllers: [AiAssistantController],
  providers: [AiAssistantService, WeeklyReportCron],
  exports: [AiAssistantService]
})
export class AiAssistantModule {}
