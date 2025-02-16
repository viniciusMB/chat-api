import { ICreateMessageUseCase } from '@message/use-cases/interfaces/create-message.interface';
import { Controller, Post, Body, Logger, Inject, Headers } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';
import { message } from '@message/ioc';

@Controller('messages')
export class CreateMessageController {
  private readonly logger = new Logger(CreateMessageController.name);
  constructor (
    @Inject(message.useCases.createMessage)
    private readonly createMessageUseCase: ICreateMessageUseCase,
  ) {}

  @Post()
  createMessage(
    @Body() payload: CreateMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    this.logger.log(`Payload recebido: ${JSON.stringify(payload)}`);
    this.createMessageUseCase.execute({ ...payload, sender: user });
    return { message: 'Mensagem recebida' };
  }
}
