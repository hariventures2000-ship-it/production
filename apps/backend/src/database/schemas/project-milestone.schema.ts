import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectMilestoneDocument = ProjectMilestone & Document;

@Schema({ timestamps: true, collection: 'project_milestones' })
export class ProjectMilestone {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: null, trim: true })
  description: string;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ default: null })
  completedDate: Date;

  @Prop({
    required: true,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING',
  })
  status: string;
}

export const ProjectMilestoneSchema = SchemaFactory.createForClass(ProjectMilestone);

ProjectMilestoneSchema.index({ projectId: 1, status: 1 });
ProjectMilestoneSchema.index({ projectId: 1, targetDate: 1 });
