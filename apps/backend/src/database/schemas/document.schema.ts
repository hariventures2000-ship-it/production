import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocumentFileDocument = DocumentFile & Document;

@Schema({ timestamps: true, collection: 'documents' })
export class DocumentFile {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedById: Types.ObjectId;

  @Prop({ required: true, trim: true }) name: string;

  @Prop({
    required: true,
    enum: ['CONTRACT', 'NDA', 'PROPOSAL', 'REPORT', 'DESIGN', 'INVOICE', 'SPECIFICATION', 'OTHER'],
    default: 'OTHER',
  })
  type: string;

  @Prop({ required: true }) cloudinaryUrl: string;
  @Prop({ required: true }) cloudinaryPublicId: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true, min: 0 }) sizeBytes: number;
  @Prop({ default: false }) isClientVisible: boolean;
  @Prop({ default: false }) isApproved: boolean;
  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) approvedBy: Types.ObjectId;
  @Prop({ default: null }) approvedAt: Date;
  @Prop({ default: null }) description: string;
}

export const DocumentFileSchema = SchemaFactory.createForClass(DocumentFile);

DocumentFileSchema.index({ projectId: 1 });
DocumentFileSchema.index({ uploadedById: 1 });
DocumentFileSchema.index({ projectId: 1, isClientVisible: 1 });
DocumentFileSchema.index({ projectId: 1, isApproved: 1 });
