import { MessageRepository } from "@message/repositories/message.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { IUpdateMessageUseCase, UpdateMessageUseCaseInput } from "./interfaces/update-message.interface";

@Injectable()
export class UpdateMessageUseCase implements IUpdateMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(input: UpdateMessageUseCaseInput) {
        const { id: messageId, text, user } = input
        const messageExist = await this.messageRepository.findById(messageId)
        if (!messageExist || messageExist.sender !== user) throw new NotFoundException("Message not found!")


        return this.messageRepository.update(messageId, { text })
    }
}