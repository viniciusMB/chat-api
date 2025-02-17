import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '@chat/schemas/chat.schema';
import { ChatMember, ChatMemberSchema } from '@chat/schemas/chat-member.schema';
import { ChatKeyService } from '@chat/services/chat-key.service';
import { chat } from '@chat/ioc';
import { CreateChatUseCase } from '@chat/use-cases/create-chat.usecase';
import { CreateChatMemberUseCase } from './use-cases/create-chat-member.usecase';
import { ChatRepository } from './repositories/chat.repository';
import { ChatMemberRepository } from './repositories/chat-member.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: ChatMember.name, schema: ChatMemberSchema }]),
  ],
  controllers: [],
  providers: [
    { provide: chat.services.chatKey, useClass: ChatKeyService },
    { provide: chat.useCases.createChat, useClass: CreateChatUseCase },
    { provide: chat.useCases.createChatMember, useClass: CreateChatMemberUseCase },
    { provide: chat.repositories.chat, useClass: ChatRepository},
    { provide: chat.repositories.chatMember, useClass: ChatMemberRepository},

  ],
  exports: [
    chat.services.chatKey, 
    chat.useCases.createChat, 
    chat.useCases.createChatMember, 
    chat.repositories.chat, 
    chat.repositories.chatMember]
})
export class ChatModule {}
