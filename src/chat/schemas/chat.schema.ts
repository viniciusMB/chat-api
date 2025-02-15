import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: false })
  title: string;

  @Prop({ default: 1 })
  seq: number;

  @Prop({ required: true, unique: true })
  chatKey: string;

  @Prop({ required: true, enum: ['DIRECT', 'GROUP'] })
  type: string;

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
