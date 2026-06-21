import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MeetingDocument = Meeting & Document;

@Schema({ timestamps: true, collection: 'meetings' })
export class Meeting {
  @Prop({ required: true, unique: true, uppercase: true })
  meetingId: string; // MET000001

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', default: null })
  projectId: Types.ObjectId;

  @Prop({ required: true, trim: true }) purpose: string;
  @Prop({ required: true }) requestedDate: Date;

  @Prop({
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({
    enum: ['GOOGLE_MEET', 'ZOOM', 'MICROSOFT_TEAMS'],
    default: 'GOOGLE_MEET',
  })
  provider: string;

  @Prop({ default: null }) meetingLink: string;
  @Prop({ default: null }) externalMeetingId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) approvedBy: Types.ObjectId;
  @Prop({ default: null }) approvedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) rejectedBy: Types.ObjectId;
  @Prop({ default: null }) rejectedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) rescheduledBy: Types.ObjectId;
  @Prop({ default: null }) rescheduledAt: Date;

  @Prop({ default: null }) notes: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
MeetingSchema.index({ clientId: 1, status: 1 });

MeetingSchema.index({ meetingId: 1 }, { unique: true });
MeetingSchema.index({ clientId: 1 });
MeetingSchema.index({ status: 1 });
MeetingSchema.index({ requestedDate: 1 });
