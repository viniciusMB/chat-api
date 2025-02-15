import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '@message/schemas/message.schema';
import { CreateMessageController } from '@message/controllers/create-message.controller';
import { ChatModule } from '@chat/chat.module';
import { MessageRepository } from './repositories/message.repository';
import { message } from '@message/ioc';
import { CreateMessageUseCase } from './use-cases/create-message.usecase';
import { ReplyMessageController } from '@message/controllers/reply-message.controller';
import { UpdateMessageUseCase } from './use-cases/update-message.usecase';
import { UpdateMessageController } from './controllers/update-message.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ChatModule
  ],
  controllers: [CreateMessageController, ReplyMessageController, UpdateMessageController],
  providers: [
    MessageRepository,
    { provide: message.useCases.createMessage, useClass: CreateMessageUseCase },
    { provide: message.useCases.updateMessage, useClass: UpdateMessageUseCase }
  ],
  exports: [
    message.useCases.createMessage
  ]
})
export class MessageModule {}
