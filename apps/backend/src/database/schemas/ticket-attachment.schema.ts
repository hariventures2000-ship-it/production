import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TicketAttachmentDocument = TicketAttachment & Document;

@Schema({ timestamps: true, collection: 'ticketAttachments' })
export class TicketAttachment {
  @Prop({ type: Types.ObjectId, ref: 'SupportTicket', required: true })
  ticketId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ required: true, trim: true }) fileName: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true, min: 0 }) fileSize: number;
  @Prop({ required: true }) storageUrl: string;
  @Prop({ default: () => new Date() }) uploadedAt: Date;
}

export const TicketAttachmentSchema = SchemaFactory.createForClass(TicketAttachment);

TicketAttachmentSchema.index({ ticketId: 1 });
TicketAttachmentSchema.index({ uploadedBy: 1 });
