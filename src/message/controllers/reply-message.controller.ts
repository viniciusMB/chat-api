import { Controller, Post, Body, Logger, Inject, Headers } from '@nestjs/common';
import { message } from '@message/ioc';
import { ReplyMessageDto } from './dtos/reply-message.dto';
import { ICreateMessageUseCase } from '@message/use-cases/interfaces/create-message.interface';

@Controller('messages')
export class ReplyMessageController {
  private readonly logger = new Logger(ReplyMessageController.name);
  constructor (
    @Inject(message.useCases.createMessage)
    private readonly createMessageUseCase: ICreateMessageUseCase,
  ) {}

  @Post('/reply')
  replyMessage(
    @Body() payload: ReplyMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    this.logger.log(`Payload recebido: ${JSON.stringify(payload)}`);
    this.createMessageUseCase.execute({ ...payload, sender: user });
    return { message: 'Mensagem recebida' };
  }
}
