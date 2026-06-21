import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SprintStatus } from '@hariventure/types';

export type SprintDocument = Sprint & Document;

class BurndownPoint {
  @Prop({ required: true }) date: Date;
  @Prop({ required: true, min: 0 }) remainingPoints: number;
  @Prop({ required: true, min: 0 }) idealPoints: number;
}

class Retrospective {
  @Prop({ type: [String], default: [] }) wentWell: string[];
  @Prop({ type: [String], default: [] }) improvements: string[];
  @Prop({ type: [String], default: [] }) actionItems: string[];
}

@Schema({ timestamps: true, collection: 'sprints' })
export class Sprint {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string; // e.g. "Sprint 1"

  @Prop({ default: null })
  goal: string;

  @Prop({
    required: true,
    enum: Object.values(SprintStatus),
    default: SprintStatus.PLANNING,
  })
  status: SprintStatus;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0, min: 0 })
  capacity: number; // story points

  @Prop({ default: 0, min: 0 })
  velocityActual: number;

  @Prop({ type: [Types.ObjectId], ref: 'Task', default: [] })
  taskIds: Types.ObjectId[];

  @Prop({ type: [BurndownPoint], default: [] })
  burndownData: BurndownPoint[];

  @Prop({ type: Retrospective, default: () => ({}) })
  retrospective: Retrospective;

  @Prop({ default: null })
  aiSummary: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);

SprintSchema.index({ projectId: 1 });
SprintSchema.index({ status: 1 });
SprintSchema.index({ projectId: 1, status: 1 });
