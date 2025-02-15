import { chat } from "@chat/ioc";
import { ICreateChatUseCase } from "@chat/use-cases/interfaces/create-chat.interface";
import { MessageRepository } from "@message/repositories/message.repository";
import { Inject, Injectable } from "@nestjs/common";
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
        if(input.reply) {
            const messageExist = await this.messageRepository.findById(input.reply)
            if (!messageExist) throw new Error("You cannot reply a message that does not exist")
        }

        const upsertChatInput = {
            sender: input.sender,
            receiver: input.receiver,
            type: input.type,
        }
        const chatDocument = await this.upsertChatUseCase.execute(upsertChatInput)
        const createMessageRepositoryInput: CreateMessageRepositoryInput = {
            sender: input.sender,
            text: input.text,
            status: input.status,
            reply: input.reply,
            receiver: chatDocument.chatKey,
            seq: chatDocument.seq
        }
        return this.messageRepository.create(createMessageRepositoryInput)
    }
}