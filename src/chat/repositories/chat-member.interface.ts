import { ChatMember } from '@chat/schemas/chat-member.schema';
import { CreateChatMemberUseCaseInput } from '@chat/use-cases/interfaces/create-chat-member.interface';

export interface IChatMemberRepository {
  create(chatMemberData: CreateChatMemberUseCaseInput): Promise<ChatMember>;
  findAll(): Promise<ChatMember[]>;
  findById(id: string): Promise<ChatMember>;
  update(id: string, updateData: Partial<ChatMember>): Promise<ChatMember>;
  delete(id: string): Promise<ChatMember>;
  findByChatId(chatId: string): Promise<ChatMember[]>;
  findByUserId(userId: string): Promise<ChatMember[]>;
  findByUserAndChat(userId: string, chatId: string): Promise<ChatMember>;
}
