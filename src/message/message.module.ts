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
import { DeleteMessageUseCase } from './use-cases/delete-message.usecase';
import { DeleteMessageController } from './controllers/delete-message.controller';
import { BucketModule } from '@common/bucket/bucket.module';
import { MessageService } from './services/message.service';
import { ReplyMessageUseCase } from './use-cases/reply-message.usecase';
import { CreateMessageWithFileUseCase } from './use-cases/create-message-with-file.usecase';
import { CreateMessageWithFileController } from './controllers/create-message-with-file.controller';
import { CreateMessageListener } from './listeners/create-message.listener';
import { DeleteMessageListener } from './listeners/delete-message.listener';
import { CreateMessageWithFileListener } from './listeners/create-message-with-file.listener';
import { UpdateMessageListener } from './listeners/update-message.listener';
import { ReplyMessageListener } from './listeners/reply-message.listener';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    ChatModule,
    BucketModule
  ],
  controllers: [
    CreateMessageController, 
    CreateMessageWithFileController, 
    ReplyMessageController, 
    UpdateMessageController, 
    DeleteMessageController,
    CreateMessageWithFileListener,
    CreateMessageListener,
    DeleteMessageListener,
    UpdateMessageListener,
    ReplyMessageListener,
  ],
  providers: [
    MessageRepository,
    { provide: message.useCases.createMessage, useClass: CreateMessageUseCase },
    { provide: message.useCases.createMessageWithFile, useClass: CreateMessageWithFileUseCase },
    { provide: message.useCases.replyMessage, useClass: ReplyMessageUseCase },
    { provide: message.useCases.updateMessage, useClass: UpdateMessageUseCase },
    { provide: message.useCases.deleteMessage, useClass: DeleteMessageUseCase },
    { provide: message.services.message, useClass: MessageService }
  ],
  exports: [
    message.services.message,
    message.useCases.createMessage,
    message.useCases.createMessageWithFile,
    message.useCases.replyMessage,
    message.useCases.updateMessage,
    message.useCases.deleteMessage,
  ]
})
export class MessageModule {}
