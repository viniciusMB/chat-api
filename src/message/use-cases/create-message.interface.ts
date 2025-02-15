import { ChatType } from "@chat/schemas/chat-type.enum";
import { Message } from "@message/schemas/message.schema";

export interface CreateMessageUseCaseInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    isReply?: boolean;
    reply?: string;
    type?: ChatType
    title?: string;
}

export interface ICreateMessageUseCase {
    execute(input: CreateMessageUseCaseInput): Promise<Message>
}