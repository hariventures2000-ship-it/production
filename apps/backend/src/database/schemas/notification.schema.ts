import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: false, collection: 'notifications' })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: [
      'TASK_ASSIGNED', 'TASK_COMPLETED', 'SPRINT_STARTED', 'SPRINT_CLOSED',
      'INVOICE_SENT', 'INVOICE_PAID', 'LEAVE_APPROVED', 'LEAVE_REJECTED',
      'LEAVE_APPLIED', 'TICKET_CREATED', 'TICKET_UPDATED', 'MENTION',
      'PROJECT_UPDATED', 'MFA_SETUP', 'SYSTEM',
    ],
  })
  type: string;

  @Prop({ required: true }) title: string;
  @Prop({ required: true }) message: string;
  @Prop({ default: null }) link: string;
  @Prop({ default: false }) isRead: boolean;
  @Prop({ type: Object, default: null }) metadata: Record<string, unknown>;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
// TTL: auto-delete after 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
