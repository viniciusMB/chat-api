import { chat } from "@chat/ioc";
import { ICreateChatUseCase } from "@chat/use-cases/interfaces/create-chat.interface";
import { Inject, Injectable } from "@nestjs/common";
import { CreateMessageRepositoryInput, IMessageRepository } from "@message/repositories/message.interface";
import { CreateMessageAndChatInput, IMessageService } from "./message.interface";
import { message } from "@message/ioc";

@Injectable()
export class MessageService implements IMessageService {
    constructor(
        @Inject(message.repositories.message)
        private readonly messageRepository: IMessageRepository,
        @Inject(chat.useCases.createChat)
        private readonly upsertChatUseCase: ICreateChatUseCase,
    ) {}

    async createMessageAndChat(input: CreateMessageAndChatInput) {
        const { sender, receiver, type, status, reply, text, file } = input
        const upsertChatInput = { sender, receiver, type }
        const chatDocument = await this.upsertChatUseCase.execute(upsertChatInput)
        const createMessageRepositoryInput: CreateMessageRepositoryInput = {
            sender,
            text,
            status,
            reply,
            file,
            receiver: chatDocument.chatKey,
            seq: chatDocument.seq
        }
        return this.messageRepository.create(createMessageRepositoryInput)
    }
}