import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: false, collection: 'auditLogs' })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ default: null }) requestId: string;

  @Prop({ default: null }) email: string;
  @Prop({ default: null }) role: string;

  @Prop({ required: true }) action: string; // e.g. 'LOGIN_SUCCESS'
  @Prop({ required: true }) module: string; // e.g. 'auth'

  @Prop({ type: Object, default: null })
  changes: { before?: Record<string, unknown>; after?: Record<string, unknown> };

  @Prop({ default: null }) ipAddress: string;
  @Prop({ default: null }) userAgent: string;
  @Prop({ enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' }) status: string;
  @Prop({ required: true, default: () => new Date() }) createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ module: 1 });
AuditLogSchema.index({ createdAt: -1 });
// TTL: auto-delete after 90 days
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
