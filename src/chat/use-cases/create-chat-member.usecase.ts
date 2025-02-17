import { Inject, Injectable } from "@nestjs/common";
import { CreateChatMemberUseCaseInput, ICreateChatMemberUseCase } from "@chat/use-cases/interfaces/create-chat-member.interface";
import { chat } from "@chat/ioc";
import { IChatMemberRepository } from "@chat/repositories/chat-member.interface";

@Injectable()
export class CreateChatMemberUseCase implements ICreateChatMemberUseCase {
  constructor(
    @Inject(chat.repositories.chatMember)
    private readonly chatMemberRepository: IChatMemberRepository
  ) {}

  async execute(input: CreateChatMemberUseCaseInput) {
    return this.chatMemberRepository.create(input);
  }
}