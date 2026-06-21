import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectRequestDocument = ProjectRequest & Document;

export enum ProjectRequestStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true, collection: 'project_requests' })
export class ProjectRequest {
  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ required: true, trim: true })
  contactPerson: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  budgetRange: string;

  @Prop({ required: true, trim: true })
  timeline: string;

  @Prop({
    required: true,
    enum: Object.values(ProjectRequestStatus),
    default: ProjectRequestStatus.PENDING,
  })
  status: ProjectRequestStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  reviewedAt: Date | null;

  @Prop({ type: String, default: null })
  reviewNotes: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Client', default: null })
  generatedClientId: Types.ObjectId | null;
}

export const ProjectRequestSchema = SchemaFactory.createForClass(ProjectRequest);

ProjectRequestSchema.index({ status: 1 });
ProjectRequestSchema.index({ email: 1 });
ProjectRequestSchema.index({ companyName: 1 });
