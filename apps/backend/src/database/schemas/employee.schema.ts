import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EmployeeSubRole, Department } from '@hariventure/types';

export type EmployeeDocument = Employee & Document;

class SalaryInfo {
  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ required: true })
  effectiveDate: Date;
}

class LeaveBalance {
  @Prop({ default: 18 })
  annual: number;

  @Prop({ default: 12 })
  sick: number;

  @Prop({ default: 6 })
  casual: number;
}

class PerformanceEntry {
  @Prop({ required: true, min: 0, max: 100 })
  score: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reviewedById: Types.ObjectId;

  @Prop({ required: true }) // e.g. "Q1-2025"
  period: string;

  @Prop({ default: null })
  notes: string;

  @Prop({ required: true })
  date: Date;
}

@Schema({ timestamps: true, collection: 'employees' })
export class Employee {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  employeeId: string; // e.g. HVD-001

  @Prop({ required: true, enum: Object.values(EmployeeSubRole) })
  subRole: EmployeeSubRole;

  @Prop({ required: true, enum: Object.values(Department) })
  department: Department;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ default: 0, min: 0 })
  experienceYears: number;

  @Prop({ type: SalaryInfo, required: true })
  salary: SalaryInfo;

  @Prop({ required: true })
  joiningDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Team', default: null })
  teamId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  managerId: Types.ObjectId; // Team Lead

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reportingTo: Types.ObjectId; // HR / CEO

  @Prop({ default: 0, min: 0, max: 100 })
  performanceScore: number;

  @Prop({ type: [PerformanceEntry], default: [] })
  performanceHistory: PerformanceEntry[];

  @Prop({ type: LeaveBalance, default: () => ({}) })
  leaveBalance: LeaveBalance;

  @Prop({
    required: true,
    enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'],
    default: 'ACTIVE',
  })
  status: string;

  @Prop({ default: null })
  terminationDate: Date;

  @Prop({ default: null })
  terminationReason: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// ─── INDEXES ────────────────────────────────────────────────────────
EmployeeSchema.index({ userId: 1 }, { unique: true });
EmployeeSchema.index({ employeeId: 1 }, { unique: true });
EmployeeSchema.index({ teamId: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ subRole: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ department: 1, subRole: 1 }); // for smart task assignment
EmployeeSchema.index({ status: 1, department: 1 });  // for workload queries
