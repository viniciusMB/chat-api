import { ChatMember } from "@chat/schemas/chat-member.schema";

export interface CreateChatMemberUseCaseInput {
    chat: string;
    user: string;
}

export interface ICreateChatMemberUseCase {
    execute(input: CreateChatMemberUseCaseInput): Promise<ChatMember>
}