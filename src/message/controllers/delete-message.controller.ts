import { Controller, Logger, Inject, Delete, Param, Headers, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DeleteMessageDto } from './dtos/delete-message.dto';
import { message } from '@message/ioc';
import { IDeleteMessageUseCase } from '@message/use-cases/interfaces/delete-message.interface';

@Controller('messages')
export class DeleteMessageController {
  private readonly logger = new Logger(DeleteMessageController.name);
  constructor(
    @Inject(message.useCases.deleteMessage)
    private readonly deleteMessageUseCase: IDeleteMessageUseCase,
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
    this.logger.log(`Payload recebido: ${JSON.stringify(dto)}`);
    await this.deleteMessageUseCase.execute(dto);
    return { message: 'Mensagem recebida' };
  }
}
