import { ChatMemberRepository } from "@chat/repositories/chat-member.repository";
import { Injectable } from "@nestjs/common";
import { CreateChatMemberUseCaseInput, ICreateChatMemberUseCase } from "@chat/use-cases/interfaces/create-chat-member.interface";

@Injectable()
export class CreateChatMemberUseCase implements ICreateChatMemberUseCase {
  constructor(private readonly chatMemberRepository: ChatMemberRepository) {}

  async execute(input: CreateChatMemberUseCaseInput) {
    return this.chatMemberRepository.create(input);
  }
}