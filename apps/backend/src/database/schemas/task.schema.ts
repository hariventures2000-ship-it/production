import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus, TaskPriority, TaskType, EmployeeSubRole } from '@hariventure/types';

export type TaskDocument = Task & Document;

class TaskComment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
  @Prop({ required: true }) text: string;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: null })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Sprint', default: null })
  sprintId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assigneeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdById: Types.ObjectId;

  // Which sub-role is best suited for this task (used by AI assignment)
  @Prop({
    enum: [...Object.values(EmployeeSubRole), 'ANY'],
    default: 'ANY',
  })
  requiredSubRole: string;

  @Prop({
    required: true,
    enum: Object.values(TaskStatus),
    default: TaskStatus.BACKLOG,
  })
  status: TaskStatus;

  @Prop({
    required: true,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({
    required: true,
    enum: Object.values(TaskType),
    default: TaskType.FEATURE,
  })
  type: TaskType;

  @Prop({ default: 0, min: 0 })
  storyPoints: number;

  @Prop({ default: 0, min: 0 })
  estimatedHours: number;

  @Prop({ default: 0, min: 0 })
  actualHours: number;

  @Prop({ default: null })
  dueDate: Date;

  @Prop({ default: null })
  completedAt: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  attachments: string[]; // Cloudinary URLs

  @Prop({ type: [TaskComment], default: [] })
  comments: TaskComment[];

  @Prop({ default: 0 })
  kanbanPosition: number; // for ordering within column

  @Prop({ default: null, min: 0, max: 100 })
  aiAssignmentScore: number; // AI confidence score
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ projectId: 1 });
TaskSchema.index({ sprintId: 1 });
TaskSchema.index({ assigneeId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ sprintId: 1, status: 1 });
TaskSchema.index({ assigneeId: 1, status: 1 });
TaskSchema.index({ projectId: 1, status: 1 });
