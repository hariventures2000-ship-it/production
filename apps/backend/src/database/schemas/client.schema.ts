import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClientDocument = Client & Document;

class BillingAddress {
  @Prop({ default: null }) street: string;
  @Prop({ default: null }) city: string;
  @Prop({ default: null }) state: string;
  @Prop({ default: 'India' }) country: string;
  @Prop({ default: null }) postalCode: string;
}

@Schema({ timestamps: true, collection: 'clients' })
export class Client {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  clientId: string;

  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ default: null, trim: true })
  industry: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  contactEmail: string;

  @Prop({ default: null })
  contactPhone: string;

  @Prop({ type: BillingAddress, default: () => ({}) })
  billingAddress: BillingAddress;

  @Prop({ type: [Types.ObjectId], ref: 'Project', default: [] })
  projectIds: Types.ObjectId[];

  @Prop({ default: 0, min: 0 })
  totalRevenue: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({
    required: true,
    enum: ['ACTIVE', 'INACTIVE', 'PROSPECT'],
    default: 'PROSPECT',
  })
  status: string;

  @Prop({ default: null })
  notes: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

ClientSchema.index({ userId: 1 });
ClientSchema.index({ contactEmail: 1 }, { unique: true });
ClientSchema.index({ status: 1 });
