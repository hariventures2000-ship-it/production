import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document;

class GeoLocation {
  @Prop({ default: null }) latitude: number;
  @Prop({ default: null }) longitude: number;
}

@Schema({ timestamps: false, collection: 'attendance' })
export class Attendance {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  date: Date; // Stored as YYYY-MM-DD midnight UTC

  @Prop({ default: null })
  checkIn: Date;

  @Prop({ default: null })
  checkOut: Date;

  @Prop({ default: 0, min: 0 })
  totalHours: number;

  @Prop({
    required: true,
    enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY'],
    default: 'ABSENT',
  })
  status: string;

  @Prop({ type: GeoLocation, default: () => ({}) })
  location: GeoLocation;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  notes: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ status: 1 });
AttendanceSchema.index({ employeeId: 1, status: 1 });
