import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

class Reaction {
  @Prop({ required: true }) emoji: string;
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] }) userIds: Types.ObjectId[];
}

@Schema({ timestamps: false, collection: 'messages' })
export class Message {
  // channelId = projectId or teamId as string
  @Prop({ required: true, index: true }) channelId: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) senderId: Types.ObjectId;
  @Prop({ default: null }) text: string;
  @Prop({ type: [String], default: [] }) attachments: string[];
  @Prop({ type: Types.ObjectId, ref: 'Message', default: null }) replyTo: Types.ObjectId;
  @Prop({ type: [Reaction], default: [] }) reactions: Reaction[];
  @Prop({ default: false }) isEdited: boolean;
  @Prop({ default: null }) deletedAt: Date;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ channelId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });
