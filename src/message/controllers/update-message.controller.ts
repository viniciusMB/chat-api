import { Controller, Body, Logger, Inject, Put, Headers } from '@nestjs/common';
import { message } from '@message/ioc';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { IUpdateMessageUseCase } from '@message/use-cases/interfaces/update-message.interface';

@Controller('messages')
export class UpdateMessageController {
  private readonly logger = new Logger(UpdateMessageController.name);
  constructor (
    @Inject(message.useCases.updateMessage)
    private readonly updateMessageUseCase: IUpdateMessageUseCase,
  ) {}

  @Put('')
  updateMessage(
    @Body() payload: UpdateMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    this.logger.log(`Payload recebido: ${JSON.stringify(payload)}`);
    this.updateMessageUseCase.execute({ ...payload, user});
    return { message: 'Mensagem recebida' };
  }
}
