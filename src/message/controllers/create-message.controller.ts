import { Controller, Post, Body, Logger, Inject, Headers } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('messages')
export class CreateMessageController {
  private readonly logger = new Logger(CreateMessageController.name);

  constructor(
    @Inject('CREATE_MESSAGE_QUEUE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async createMessage(
    @Body() payload: CreateMessageDto,
    @Headers('X-User-Id') user: string,
  ): Promise<any> {
    const messageData = { ...payload, sender: user };
    this.logger.log(`Sending message to queue: ${JSON.stringify(messageData)}`);

    this.client.emit('create_message', messageData);

    return { message: 'Mensagem recebida' };
  }
}
