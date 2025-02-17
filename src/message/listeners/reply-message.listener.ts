import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IReplyMessageUseCase } from '@message/use-cases/interfaces/reply-message.interface';
import { message } from '@message/ioc';

@Controller()
export class ReplyMessageListener {
  private readonly logger = new Logger(ReplyMessageListener.name);

  constructor(
    @Inject(message.useCases.replyMessage)
    private readonly replyMessageUseCase: IReplyMessageUseCase,
  ) {}

  @EventPattern('reply_message')
  async handleReplyMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.replyMessageUseCase.execute(data);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(
        `Erro ao processar resposta de mensagem: ${error.message}`,
        error.stack,
      );
      channel.nack(originalMessage, false, false);
    }
  }
}
