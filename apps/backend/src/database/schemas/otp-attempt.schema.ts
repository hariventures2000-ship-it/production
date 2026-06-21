import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpAttemptDocument = OtpAttempt & Document;

@Schema({ timestamps: true, collection: 'otpAttempts' })
export class OtpAttempt {
  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, enum: ['LOGIN', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'ACCOUNT_RECOVERY'] })
  purpose: string;

  @Prop({ type: String, required: true })
  otpHash: string;

  @Prop({ type: Number, default: 0 })
  attempts: number;

  @Prop({ type: Boolean, default: false })
  verified: boolean;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  createdAt?: Date;
}

export const OtpAttemptSchema = SchemaFactory.createForClass(OtpAttempt);

OtpAttemptSchema.index({ email: 1, purpose: 1 });
OtpAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
