import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IDeleteMessageUseCase, DeleteMessageUseCaseInput } from "./interfaces/delete-message.interface";
import { message } from "@message/ioc";
import { IMessageRepository } from "@message/repositories/message.interface";

@Injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
    constructor(
        @Inject(message.repositories.message)
        private readonly messageRepository: IMessageRepository,
    ) {}

    async execute(input: DeleteMessageUseCaseInput) {
        const { id: messageId, user } = input
        const messageExist = await this.messageRepository.findById(messageId)
        if (!messageExist || user !== messageExist.sender) throw new NotFoundException("Message not found!")

        return this.messageRepository.delete(messageId)
    }
}