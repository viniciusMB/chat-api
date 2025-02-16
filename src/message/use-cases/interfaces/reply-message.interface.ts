import { ChatType } from "@chat/schemas/chat-type.enum";
import { Message } from "@message/schemas/message.schema";

export interface ReplyMessageUseCaseInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    reply?: string;
    type?: ChatType
    title?: string;
}

export interface IReplyMessageUseCase {
    execute(input: ReplyMessageUseCaseInput): Promise<Message>
}