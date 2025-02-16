import { ChatType } from "@chat/schemas/chat-type.enum";

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