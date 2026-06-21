import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportTicket, SupportTicketDocument } from '../../database/schemas/support-ticket.schema';
import { TicketAttachment, TicketAttachmentDocument } from '../../database/schemas/ticket-attachment.schema';
import { Counter, CounterDocument } from '../../database/schemas/counter.schema';
import { Client, ClientDocument } from '../../database/schemas/client.schema';
import { AuditService } from '../audit/audit.service';
import { AuditEvent } from '../audit/enums/audit-event.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(SupportTicket.name) private ticketModel: Model<SupportTicketDocument>,
    @InjectModel(TicketAttachment.name) private attachmentModel: Model<TicketAttachmentDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    private readonly auditService: AuditService,
  ) {}

  private async getClientByUserId(userId: string): Promise<ClientDocument> {
    const client = await this.clientModel.findOne({ userId });
    if (!client) throw new NotFoundException('Client profile not found');
    return client;
  }

  private async getNextSequence(name: string): Promise<number> {
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    return counter.seq;
  }

  async createTicket(userId: string, data: any) {
    const client = await this.getClientByUserId(userId);
    const seq = await this.getNextSequence('ticketId');
    const ticketNumber = `TKT${seq.toString().padStart(6, '0')}`;

    const newTicket = await this.ticketModel.create({
      ticketNumber,
      clientId: client._id,
      projectId: data.projectId,
      subject: data.subject,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      status: 'OPEN',
    });

    await this.auditService.logEvent({
      userId,
      role: 'CLIENT' as any,
      action: AuditEvent.TICKET_CREATED as any,
      module: 'tickets',
      metadata: { ticketId: newTicket._id, ticketNumber },
    });

    return newTicket;
  }

  async getClientTickets(userId: string) {
    const client = await this.getClientByUserId(userId);
    return this.ticketModel.find({ clientId: client._id }).sort({ createdAt: -1 }).lean();
  }

  async getTicket(userId: string, ticketId: string, role: string) {
    let query: any = { _id: ticketId };
    
    if (role === 'CLIENT') {
      const client = await this.getClientByUserId(userId);
      query.clientId = client._id;
    }

    const ticket = await this.ticketModel.findOne(query).lean();
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async replyToTicket(userId: string, role: string, ticketId: string, message: string) {
    let query: any = { _id: ticketId };
    if (role === 'CLIENT') {
      const client = await this.getClientByUserId(userId);
      query.clientId = client._id;
    }

    const ticket = await this.ticketModel.findOne(query);
    if (!ticket) throw new NotFoundException('Ticket not found');
    
    if (ticket.status === 'CLOSED') {
      throw new BadRequestException('Cannot reply to a closed ticket');
    }

    // Update SLA first response
    if (role !== 'CLIENT' && !ticket.firstResponseAt) {
      ticket.firstResponseAt = new Date();
      // Calculate SLA status placeholder
      ticket.slaStatus = 'ON_TRACK'; 
    }

    ticket.messages.push({
      senderId: userId as any,
      senderRole: role,
      message,
      attachments: [],
      createdAt: new Date()
    });

    // Auto update status
    if (role === 'CLIENT' && ticket.status === 'WAITING_FOR_CLIENT') {
      ticket.status = 'IN_PROGRESS';
    } else if (role !== 'CLIENT' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
    }

    await ticket.save();

    await this.auditService.logEvent({
      userId,
      role: role as any,
      action: AuditEvent.TICKET_UPDATED as any,
      module: 'tickets',
      metadata: { ticketId },
    });

    return ticket;
  }

  async updateTicketStatus(userId: string, role: string, ticketId: string, status: string) {
    let query: any = { _id: ticketId };
    if (role === 'CLIENT') {
      const client = await this.getClientByUserId(userId);
      query.clientId = client._id;
      if (status !== 'CLOSED') {
        throw new ForbiddenException('Clients can only close tickets');
      }
    }

    const ticket = await this.ticketModel.findOne(query);
    if (!ticket) throw new NotFoundException('Ticket not found');

    ticket.status = status;
    
    if (status === 'RESOLVED' || status === 'CLOSED') {
      if (!ticket.resolvedAt) ticket.resolvedAt = new Date();
    }

    await ticket.save();

    const actionEvent = status === 'RESOLVED' ? AuditEvent.TICKET_RESOLVED : 
                        status === 'CLOSED' ? AuditEvent.TICKET_CLOSED : AuditEvent.TICKET_UPDATED;

    await this.auditService.logEvent({
      userId,
      role: role as any,
      action: actionEvent as any,
      module: 'tickets',
      metadata: { ticketId, status },
    });

    return ticket;
  }

  async assignTicket(userId: string, ticketId: string, assigneeId: string) {
    const ticket = await this.ticketModel.findById(ticketId);
    if (!ticket) throw new NotFoundException('Ticket not found');

    ticket.assignedTo = assigneeId as any;
    ticket.assignedAt = new Date();
    await ticket.save();

    await this.auditService.logEvent({
      userId,
      role: 'HR' as any,
      action: AuditEvent.TICKET_ASSIGNED as any,
      module: 'tickets',
      metadata: { ticketId, assigneeId },
    });

    return ticket;
  }

  async getAllInternalTickets() {
    return this.ticketModel.find().sort({ createdAt: -1 }).lean();
  }
}
