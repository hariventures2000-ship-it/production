import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { SupportTicket, SupportTicketSchema } from '../../database/schemas/support-ticket.schema';
import { TicketAttachment, TicketAttachmentSchema } from '../../database/schemas/ticket-attachment.schema';
import { Counter, CounterSchema } from '../../database/schemas/counter.schema';
import { Client, ClientSchema } from '../../database/schemas/client.schema';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportTicket.name, schema: SupportTicketSchema },
      { name: TicketAttachment.name, schema: TicketAttachmentSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    AuditModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService]
})
export class TicketsModule {}
