import { chat } from "@chat/ioc";
import { ICreateChatUseCase } from "@chat/use-cases/interfaces/create-chat.interface";
import { MessageRepository } from "@message/repositories/message.repository";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMessageUseCaseInput, ICreateMessageUseCase } from "./interfaces/create-message.interface";
import { CreateMessageRepositoryInput } from "@message/repositories/message.interface";

@Injectable()
export class CreateMessageUseCase implements ICreateMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
        @Inject(chat.useCases.createChat)
        private readonly upsertChatUseCase: ICreateChatUseCase,
    ) {}

    async execute(input: CreateMessageUseCaseInput) {
        const { sender, receiver, type, status, reply, text } = input
        if(reply) {
            const messageExist = await this.messageRepository.findById(reply)
            if (!messageExist) throw new NotFoundException("Message not found!")
        }

        const upsertChatInput = { sender, receiver, type }
        const chatDocument = await this.upsertChatUseCase.execute(upsertChatInput)
        const createMessageRepositoryInput: CreateMessageRepositoryInput = {
            sender,
            text,
            status,
            reply,
            receiver: chatDocument.chatKey,
            seq: chatDocument.seq
        }
        return this.messageRepository.create(createMessageRepositoryInput)
    }
}