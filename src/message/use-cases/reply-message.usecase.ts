import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { message } from "@message/ioc";
import { IMessageService } from "@message/services/message.interface";
import { IReplyMessageUseCase, ReplyMessageUseCaseInput } from "./interfaces/reply-message.interface";
import { IMessageRepository } from "@message/repositories/message.interface";

@Injectable()
export class ReplyMessageUseCase implements IReplyMessageUseCase {
    constructor(
        @Inject(message.repositories.message)
        private readonly messageRepository: IMessageRepository,
        @Inject(message.services.message)
        private readonly messageService: IMessageService,
    ) {}

    async execute(input: ReplyMessageUseCaseInput) {
        const { reply } = input
        const messageExist = await this.messageRepository.findById(reply)

        if (!messageExist) throw new NotFoundException("Message not found!")
        
        return this.messageService.createMessageAndChat(input)
    }
}