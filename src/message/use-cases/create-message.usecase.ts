import { Inject, Injectable } from "@nestjs/common";
import { CreateMessageUseCaseInput, ICreateMessageUseCase } from "./interfaces/create-message.interface";
import { message } from "@message/ioc";
import { IMessageService } from "@message/services/message.interface";

@Injectable()
export class CreateMessageUseCase implements ICreateMessageUseCase {
    constructor(
        @Inject(message.services.message)
        private readonly messageService: IMessageService,
    ) {}

    async execute(input: CreateMessageUseCaseInput) {
        return this.messageService.createMessageAndChat(input)
    }
}