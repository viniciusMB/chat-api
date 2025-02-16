import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class FileInfo {
  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  contentType: string;

  @Prop({ required: true })
  downloadUrl: string;
}

export const FileInfoSchema = SchemaFactory.createForClass(FileInfo);

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

  @Prop({ required: false, type: FileInfoSchema })
  file?: FileInfo;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null, index: true })
  reply?: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
