import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectUpdateDocument = ProjectUpdate & Document;

@Schema({ timestamps: true, collection: 'project_updates' })
export class ProjectUpdate {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: false })
  isApprovedForClient: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  approvedBy: Types.ObjectId;

  @Prop({ default: null })
  approvedAt: Date;
}

export const ProjectUpdateSchema = SchemaFactory.createForClass(ProjectUpdate);

ProjectUpdateSchema.index({ projectId: 1, isApprovedForClient: 1 });
ProjectUpdateSchema.index({ createdBy: 1 });
