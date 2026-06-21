import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

// Identical to AuditLog but stored in a separate collection.
// We use a TTL index of 275 days (365 - 90) to delete it from the archive automatically.
@Schema({ timestamps: true })
export class AuditArchive extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ default: null })
  requestId: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  role: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  module: string;

  @Prop({ default: null })
  ipAddress: string;

  @Prop({ default: null })
  userAgent: string;

  @Prop({ default: 'SUCCESS', enum: ['SUCCESS', 'FAILURE'] })
  status: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  changes: Record<string, any>;

  // This is the original creation date of the log, copied over.
  @Prop({ required: true })
  originalCreatedAt: Date;

  // Set TTL index on standard createdAt for the archive itself (275 days = 23760000 seconds)
  // Total lifespan: 90 days in Hot + 275 days in Archive = 365 Days
  @Prop({ default: Date.now, expires: 23760000 })
  createdAt: Date;
}

export type AuditArchiveDocument = AuditArchive & Document;
export const AuditArchiveSchema = SchemaFactory.createForClass(AuditArchive);
