import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMemberDocument = ChatMember & Document;

@Schema({ timestamps: true })
export class ChatMember {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Chat' })
  chat: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  user: Types.ObjectId;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const ChatMemberSchema = SchemaFactory.createForClass(ChatMember);

ChatMemberSchema.index({ chat: 1, user: 1 }, { unique: true });
