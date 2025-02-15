import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Chat' })
  receiver: Types.ObjectId;

  @Prop({ required: true })
  seq: number;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null, index: true })
  reply?: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
