import { Controller, Delete, Param, Headers, BadRequestException, Logger, Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller('messages')
export class DeleteMessageController {
  private readonly logger = new Logger(DeleteMessageController.name);

  constructor(
    @Inject('DELETE_MESSAGE_QUEUE') private readonly client: ClientProxy,
  ) {}

  @Delete(':id')
  async deleteMessage(
    @Param('id') messageId: string,
    @Headers('X-User-Id') user: string,
  ): Promise<any> {
    const dto = plainToInstance(DeleteMessageDto, { id: messageId, user });
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    this.logger.log(`Request Data: ${JSON.stringify(dto)}`);

    this.client.emit('delete_message', dto);

    return { message: 'Message received' };
  }
}
