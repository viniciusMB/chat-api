import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUpdateMessageUseCase, UpdateMessageUseCaseInput } from "./interfaces/update-message.interface";
import { message } from "@message/ioc";
import { IMessageRepository } from "@message/repositories/message.interface";

@Injectable()
export class UpdateMessageUseCase implements IUpdateMessageUseCase {
    constructor(
        @Inject(message.repositories.message)
        private readonly messageRepository: IMessageRepository,
    ) {}

    async execute(input: UpdateMessageUseCaseInput) {
        const { id: messageId, text, user } = input
        const messageExist = await this.messageRepository.findById(messageId)
        if (!messageExist || messageExist.sender !== user) throw new NotFoundException("Message not found!")


        return this.messageRepository.update(messageId, { text })
    }
}