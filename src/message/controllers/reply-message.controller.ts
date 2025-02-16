import { Controller, Post, Body, Logger, Inject, Headers } from '@nestjs/common';
import { message } from '@message/ioc';
import { ReplyMessageDto } from './dtos/reply-message.dto';
import { IReplyMessageUseCase } from '@message/use-cases/interfaces/reply-message.interface';

@Controller('messages')
export class ReplyMessageController {
  private readonly logger = new Logger(ReplyMessageController.name);
  constructor (
    @Inject(message.useCases.replyMessage)
    private readonly replyMessageUseCase: IReplyMessageUseCase,
  ) {}

  @Post('/reply')
  replyMessage(
    @Body() payload: ReplyMessageDto,
    @Headers('X-User-Id') user: string,
  ): any {
    this.logger.log(`Payload recebido: ${JSON.stringify(payload)}`);
    this.replyMessageUseCase.execute({ ...payload, sender: user });
    return { message: 'Mensagem recebida' };
  }
}
