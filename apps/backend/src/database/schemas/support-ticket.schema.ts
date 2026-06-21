import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupportTicketDocument = SupportTicket & Document;

class TicketMessage {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) senderId: Types.ObjectId;
  @Prop({ required: true }) senderRole: string;
  @Prop({ required: true }) message: string;
  @Prop({ type: [String], default: [] }) attachments: string[];
  @Prop({ default: () => new Date() }) createdAt: Date;
}

@Schema({ timestamps: true, collection: 'supportTickets' })
export class SupportTicket {
  @Prop({ required: true, unique: true, uppercase: true })
  ticketNumber: string; // TKT-001

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', default: null })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo: Types.ObjectId;

  @Prop({ required: true, trim: true }) subject: string;
  @Prop({ required: true }) description: string;

  @Prop({
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM',
  })
  priority: string;

  @Prop({
    required: true,
    enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_CLIENT', 'ESCALATED', 'RESOLVED', 'CLOSED'],
    default: 'OPEN',
  })
  status: string;

  @Prop({ type: [TicketMessage], default: [] })
  messages: TicketMessage[];

  @Prop({ default: null }) assignedAt: Date;
  @Prop({ default: null }) firstResponseAt: Date;
  @Prop({ default: null }) resolvedAt: Date;
  
  @Prop({
    enum: ['ON_TRACK', 'AT_RISK', 'BREACHED'],
    default: 'ON_TRACK',
  })
  slaStatus: string;
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);
SupportTicketSchema.index({ clientId: 1, status: 1 });

SupportTicketSchema.index({ ticketNumber: 1 }, { unique: true });
SupportTicketSchema.index({ clientId: 1 });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ assigneeId: 1 });
SupportTicketSchema.index({ clientId: 1, status: 1 });
