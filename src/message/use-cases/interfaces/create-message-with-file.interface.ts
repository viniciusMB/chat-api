import { ChatType } from "@chat/schemas/chat-type.enum";
import { Message } from "@message/schemas/message.schema";

export interface CreateMessageWithFileUseCaseInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    reply?: string;
    type?: ChatType
    title?: string;
    file: Express.Multer.File
}

export interface ICreateMessageWithFileUseCase {
    execute(input: CreateMessageWithFileUseCaseInput): Promise<Message>
}