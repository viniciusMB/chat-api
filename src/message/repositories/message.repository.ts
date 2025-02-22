import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '@message/schemas/message.schema';
import { CreateMessageRepositoryInput, IMessageRepository } from '@message/repositories/message.interface';
@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(messageData: CreateMessageRepositoryInput): Promise<Message> {
    const createdMessage = new this.messageModel(messageData);
    return createdMessage.save();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async findById(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<Message>): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<Message> {
    await this.deleteReplies(id);
    return this.messageModel.findByIdAndDelete(id).exec();
  }

  async findReplies(messageId: string): Promise<Message[]> {
    return this.messageModel.find({ reply: messageId }).exec();
  }

  private async deleteReplies(messageId: string): Promise<void> {
    await this.messageModel.deleteMany({ reply: messageId });

  }
}
