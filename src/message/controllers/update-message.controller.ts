import { Controller, Body, Logger, Inject, Put, Headers } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateMessageDto } from './dtos/update-message.dto';

@Controller('messages')
export class UpdateMessageController {
  private readonly logger = new Logger(UpdateMessageController.name);

  constructor(
    @Inject('UPDATE_MESSAGE_QUEUE')
    private readonly client: ClientProxy,
  ) {}

  @Put('')
  updateMessage(
    @Body() payload: UpdateMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    const messageData = { ...payload, user };
    this.logger.log(`Payload recebido: ${JSON.stringify(messageData)}`);
    this.client.emit('update_message', messageData);
    return { message: 'Mensagem recebida' };
  }
}
