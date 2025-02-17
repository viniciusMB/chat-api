import { Controller, Post, Body, Logger, Inject, Headers } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReplyMessageDto } from './dtos/reply-message.dto';

@Controller('messages')
export class ReplyMessageController {
  private readonly logger = new Logger(ReplyMessageController.name);

  constructor(
    @Inject('REPLY_MESSAGE_QUEUE')
    private readonly client: ClientProxy,
  ) {}

  @Post('/reply')
  replyMessage(
    @Body() payload: ReplyMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    const messageData = { ...payload, sender: user };
    this.logger.log(`Payload recebido: ${JSON.stringify(messageData)}`);
    this.client.emit('reply_message', messageData);
    return { message: 'Mensagem recebida' };
  }
}
