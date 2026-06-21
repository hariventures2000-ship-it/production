import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditChecksum extends Document {
  @Prop({ required: true, unique: true })
  date: string; // e.g. YYYY-MM-DD

  @Prop({ required: true })
  hash: string; // SHA-256 of all audit events on that date

  @Prop({ required: true })
  recordCount: number;

  @Prop({ required: true, default: () => new Date() })
  verifiedAt: Date;
}

export type AuditChecksumDocument = AuditChecksum & Document;
export const AuditChecksumSchema = SchemaFactory.createForClass(AuditChecksum);
