import { ChatType } from "@chat/schemas/chat-type.enum";
import { FileInfo, Message } from "@message/schemas/message.schema";

export interface CreateMessageAndChatInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    file?: FileInfo;
    reply?: string;
    type?: ChatType
    title?: string;
}

export interface IMessageService {
    createMessageAndChat(input: CreateMessageAndChatInput): Promise<Message>
}