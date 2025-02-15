import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMember, ChatMemberDocument } from '@chat/schemas/chat-member.schema';
import { CreateChatMemberUseCaseInput } from '@chat/use-cases/interfaces/create-chat-member.interface';

@Injectable()
export class ChatMemberRepository {
  constructor(
    @InjectModel(ChatMember.name)
    private readonly chatMemberModel: Model<ChatMemberDocument>,
  ) {}

  async create(chatMemberData: CreateChatMemberUseCaseInput): Promise<ChatMember> {
    const createdChatMember = new this.chatMemberModel(chatMemberData);
    return createdChatMember.save();
  }

  async findAll(): Promise<ChatMember[]> {
    return this.chatMemberModel.find().exec();
  }

  async findById(id: string): Promise<ChatMember> {
    return this.chatMemberModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<ChatMember>): Promise<ChatMember> {
    return this.chatMemberModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<ChatMember> {
    return this.chatMemberModel.findByIdAndDelete(id).exec();
  }

  async findByChatId(chatId: string): Promise<ChatMember[]> {
    return this.chatMemberModel.find({ chat: chatId }).exec();
  }

  async findByUserId(userId: string): Promise<ChatMember[]> {
    return this.chatMemberModel.find({ user: userId }).exec();
  }
}
