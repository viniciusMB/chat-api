import { ChatType } from "@chat/schemas/chat-type.enum";

export interface CreateMessageRepositoryInput {
    sender: string;
    receiver: string;
    text: string;
    status?: string;
    isReply?: boolean;
    reply?: string;
    type?: ChatType
    seq: number;
}