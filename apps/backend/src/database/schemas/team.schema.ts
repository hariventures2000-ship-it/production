import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department } from '@hariventure/types';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true, collection: 'teams' })
export class Team {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  leadId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  memberIds: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Project', default: [] })
  projectIds: Types.ObjectId[];

  @Prop({ required: true, enum: Object.values(Department) })
  department: Department;

  @Prop({ default: 8, min: 1 })
  maxCapacity: number;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ leadId: 1 });
TeamSchema.index({ memberIds: 1 });
TeamSchema.index({ department: 1 });
