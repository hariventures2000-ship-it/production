import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true, collection: 'invoices' })
export class Invoice {
  @Prop({ required: true, unique: true, uppercase: true })
  invoiceNumber: string; // INV000001

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true }) description: string;
  
  @Prop({ required: true, min: 0 }) amount: number;
  
  @Prop({ required: true, default: 'INR' }) currency: string;

  @Prop({
    required: true,
    enum: ['DRAFT', 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ required: true }) dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
InvoiceSchema.index({ clientId: 1, status: 1 });

InvoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ clientId: 1 });
InvoiceSchema.index({ projectId: 1 });
InvoiceSchema.index({ status: 1 });
