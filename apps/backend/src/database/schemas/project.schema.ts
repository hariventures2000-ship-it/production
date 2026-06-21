import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department, ProjectStatus, ProjectPriority } from '@hariventure/types';

export type ProjectDocument = Project & Document;


@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team', default: null })
  teamId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  teamLeadId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(Department) })
  department: Department;

  @Prop({
    required: true,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  @Prop({
    required: true,
    enum: ['Requirements', 'Design', 'Development', 'Testing', 'Deployment', 'Maintenance'],
    default: 'Requirements',
  })
  currentPhase: string;

  @Prop({
    required: true,
    enum: Object.values(ProjectPriority),
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  estimatedEndDate: Date;

  @Prop({ default: null })
  actualEndDate: Date;

  @Prop({ required: true, min: 0 })
  budget: number;

  @Prop({ default: 0, min: 0 })
  actualCost: number;

  @Prop({ default: 0, min: 0, max: 100 })
  completionPercentage: number;

  @Prop({ type: [Types.ObjectId], ref: 'Sprint', default: [] })
  sprintIds: Types.ObjectId[];


  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ default: null })
  repositoryUrl: string;

  @Prop({ default: null })
  liveUrl: string;

  @Prop({ default: null, min: 0, max: 100 })
  riskScore: number; // AI-generated

  @Prop({ default: null })
  aiSummary: string;

  @Prop({ default: 'INR' })
  currency: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ clientId: 1 });
ProjectSchema.index({ teamId: 1 });
ProjectSchema.index({ teamLeadId: 1 });
ProjectSchema.index({ department: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ status: 1, priority: 1 });
ProjectSchema.index({ clientId: 1, status: 1 });
ProjectSchema.index({ clientId: 1, updatedAt: -1 });
