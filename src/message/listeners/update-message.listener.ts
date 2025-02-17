import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IUpdateMessageUseCase } from '@message/use-cases/interfaces/update-message.interface';
import { message } from '@message/ioc';

@Controller()
export class UpdateMessageListener {
  private readonly logger = new Logger(UpdateMessageListener.name);

  constructor(
    @Inject(message.useCases.updateMessage)
    private readonly updateMessageUseCase: IUpdateMessageUseCase,
  ) {}

  @EventPattern('update_message')
  async handleUpdateMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.updateMessageUseCase.execute(data);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(
        `Erro ao processar atualização de mensagem: ${error.message}`,
        error.stack,
      );
      channel.nack(originalMessage, false, false);
    }
  }
}
