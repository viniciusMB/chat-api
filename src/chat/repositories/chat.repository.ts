import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '@chat/schemas/chat.schema';
import { IChatRepository } from './chat.interface';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
  ) {}

  async create(chatData: Partial<Chat>): Promise<Chat> {
    const createdChat = new this.chatModel(chatData);
    return createdChat.save();
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  async findById(id: string): Promise<Chat> {
    return this.chatModel.findById(id).exec();
  }

  async findByChatKey(chatKey: string): Promise<Chat> {
    return this.chatModel.findOne({ chatKey }).exec();
  }

  async findByChatKeyIncSeq(chatKey: string): Promise<Chat> {
    return this.chatModel
      .findOneAndUpdate(
        { chatKey },
        { $inc: { seq: 1 } },
        { new: true }
      )
      .exec();
  }

  async update(id: string, updateData: Partial<Chat>): Promise<Chat> {
    return this.chatModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<Chat> {
    return this.chatModel.findByIdAndDelete(id).exec();
  }
}
