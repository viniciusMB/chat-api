import { ChatType } from "@chat/schemas/chat-type.enum";
import { Message } from "@message/schemas/message.schema";

export interface FileInfo {
    filePath: string;
    contentType: string;
    downloadUrl: string;
}

export interface CreateMessageRepositoryInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    file?: FileInfo
    isReply?: boolean;
    reply?: string;
    type?: ChatType
    seq: number;
}

export interface IMessageRepository {
  create(messageData: CreateMessageRepositoryInput): Promise<Message>;
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message>;
  update(id: string, updateData: Partial<Message>): Promise<Message>;
  delete(id: string): Promise<Message>;
  findReplies(messageId: string): Promise<Message[]>;
}
