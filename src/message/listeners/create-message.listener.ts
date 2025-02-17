import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ICreateMessageUseCase } from '@message/use-cases/interfaces/create-message.interface';
import { message } from '@message/ioc';

@Controller()
export class CreateMessageListener {
  private readonly logger = new Logger(CreateMessageListener.name);

  constructor(
    @Inject(message.useCases.createMessage)
    private readonly createMessageUseCase: ICreateMessageUseCase,
  ) {}

  @EventPattern('create_message')
  async handleMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.createMessageUseCase.execute(data);
      channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(`Erro ao processar mensagem: ${error.message}`, error.stack);

      channel.nack(originalMessage, false, false);
    }
  }
  
}
