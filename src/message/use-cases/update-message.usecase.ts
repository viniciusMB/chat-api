import { MessageRepository } from "@message/repositories/message.repository";
import { Injectable } from "@nestjs/common";
import { IUpdateMessageUseCase, UpdateMessageUseCaseInput } from "./interfaces/update-message.interface";

@Injectable()
export class UpdateMessageUseCase implements IUpdateMessageUseCase {
    constructor(
        private readonly messageRepository: MessageRepository,
    ) {}

    async execute(input: UpdateMessageUseCaseInput) {
        const { id: messageId, text } = input
        const messageExist = await this.messageRepository.findById(messageId)
        if (!messageExist) throw new Error("You cannot edit a message that does not exist")


        return this.messageRepository.update(messageId, { text })
    }
}