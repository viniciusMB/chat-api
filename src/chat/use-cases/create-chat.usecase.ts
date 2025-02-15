import { ChatRepository } from "@chat/repositories/chat.repository";
import { ChatType } from "@chat/schemas/chat-type.enum";
import { IChatKeyService } from "@chat/services/chat-key.inteface";
import { chat } from "@chat/ioc";
import { Inject, Injectable } from "@nestjs/common";
import { CreateChatUseCaseInput, ICreateChatUseCase } from "./interfaces/create-chat.interface";
import { ICreateChatMemberUseCase } from "./interfaces/create-chat-member.interface";

@Injectable()
export class CreateChatUseCase implements ICreateChatUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    @Inject(chat.services.chatKey)
    private readonly chatKeyService: IChatKeyService,
    @Inject(chat.useCases.createChatMember)
    private readonly createChatMemberUseCase: ICreateChatMemberUseCase
  ) {}

  async execute(input: CreateChatUseCaseInput) {
    const { sender, receiver, title, type } = input;
    
    if (type !== ChatType.DIRECT) throw new Error('Invalid Chat Type!')
    
    const chatKey = this.chatKeyService.generateChatKey([sender, receiver])
     
    
    let chat = await this.chatRepository.findByChatKeyIncSeq(chatKey);
    if (!chat) {
      chat = await this.chatRepository.create({
        title: title,
        type,
        chatKey,
      });

      const createChatMembers = [
        this.createChatMemberUseCase.execute({chat: chatKey, user: sender}), 
        this.createChatMemberUseCase.execute({ chat: chatKey, user: receiver })
      ]
      await Promise.all(createChatMembers)
    }
    return chat;
  }
}