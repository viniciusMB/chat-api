import { MessageRepository } from "@message/repositories/message.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { IDeleteMessageUseCase, DeleteMessageUseCaseInput } from "./interfaces/delete-message.interface";

@Injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(input: DeleteMessageUseCaseInput) {
        const { id: messageId, user } = input
        const messageExist = await this.messageRepository.findById(messageId)
        if (!messageExist || user !== messageExist.sender) throw new NotFoundException("Message not found!")

        return this.messageRepository.delete(messageId)
    }
}