import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ required: true, unique: true, uppercase: true })
  paymentNumber: string; // PAY000001

  @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true })
  invoiceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ required: true, min: 0 }) amount: number;
  
  @Prop({ required: true, default: 'INR' }) currency: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ default: null }) razorpayOrderId: string;
  @Prop({ default: null }) razorpayPaymentId: string;
  @Prop({ default: null }) razorpaySignature: string;

  @Prop({ default: null }) receiptUrl: string;

  @Prop({ default: null }) paidAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ clientId: 1, createdAt: -1 });

PaymentSchema.index({ paymentNumber: 1 }, { unique: true });
PaymentSchema.index({ clientId: 1 });
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });
