import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '@message/schemas/message.schema';
import { CreateMessageController } from '@message/controllers/create-message.controller';
import { ChatModule } from '@chat/chat.module';
import { MessageRepository } from './repositories/message.repository';
import { message } from '@message/ioc';
import { CreateMessageUseCase } from './use-cases/create-message.usecase';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ChatModule
  ],
  controllers: [CreateMessageController],
  providers: [
    MessageRepository,
    { provide: message.useCases.createMessage, useClass: CreateMessageUseCase }
  ],
  exports: [
    message.useCases.createMessage
  ]
})
export class MessageModule {}
