import { ChatType } from "@chat/schemas/chat-type.enum";
import { Chat } from "@chat/schemas/chat.schema";

export interface CreateChatUseCaseInput {
    sender: string;
    receiver: string;
    title?: string;
    type: ChatType
}

export interface ICreateChatUseCase {
    execute(createChatDto: CreateChatUseCaseInput): Promise<Chat>
}
