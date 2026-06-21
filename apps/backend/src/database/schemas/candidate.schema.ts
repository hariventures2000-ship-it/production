import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CandidateDocument = Candidate & Document;

class Interview {
  @Prop({ required: true }) scheduledAt: Date;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) interviewerId: Types.ObjectId;
  @Prop({ enum: ['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL'], required: true }) type: string;
  @Prop({ default: null }) feedback: string;
  @Prop({ default: null, min: 1, max: 5 }) rating: number;
  @Prop({ enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' }) status: string;
}

@Schema({ timestamps: true, collection: 'candidates' })
export class Candidate {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true }) email: string;
  @Prop({ default: null }) phone: string;
  @Prop({ required: true, trim: true }) position: string;
  @Prop({ default: null }) resumeUrl: string; // Cloudinary
  @Prop({ type: [String], default: [] }) skills: string[];
  @Prop({ default: 0, min: 0 }) experienceYears: number;

  @Prop({
    required: true,
    enum: ['APPLIED', 'SCREENING', 'INTERVIEW_1', 'INTERVIEW_2', 'TECHNICAL', 'HR', 'OFFER', 'HIRED', 'REJECTED'],
    default: 'APPLIED',
  })
  stage: string;

  @Prop({ type: [Interview], default: [] }) interviews: Interview[];
  @Prop({ default: null }) offerLetterUrl: string;
  @Prop({ default: null }) expectedSalary: number;
  @Prop({ default: null }) offeredSalary: number;
  @Prop({ default: null }) joiningDate: Date;
  @Prop({ default: null }) notes: string;
  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) createdById: Types.ObjectId;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);

CandidateSchema.index({ stage: 1 });
CandidateSchema.index({ email: 1 }, { unique: true });
CandidateSchema.index({ position: 1 });
