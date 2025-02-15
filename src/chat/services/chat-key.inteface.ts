export interface IChatKeyService {
    generateChatKey(userIds: string[], title?: string): string
}