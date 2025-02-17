import { Chat } from '@chat/schemas/chat.schema';

export interface IChatRepository {
  create(chatData: Partial<Chat>): Promise<Chat>;
  findAll(): Promise<Chat[]>;
  findById(id: string): Promise<Chat>;
  findByChatKey(chatKey: string): Promise<Chat>;
  findByChatKeyIncSeq(chatKey: string): Promise<Chat>;
  update(id: string, updateData: Partial<Chat>): Promise<Chat>;
  delete(id: string): Promise<Chat>;
}
