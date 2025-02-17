import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { IDeleteMessageUseCase } from '@message/use-cases/interfaces/delete-message.interface';
import { message } from '@message/ioc';

@Controller()
export class DeleteMessageListener {
  private readonly logger = new Logger(DeleteMessageListener.name);

  constructor(
    @Inject(message.useCases.deleteMessage)
    private readonly deleteMessageUseCase: IDeleteMessageUseCase,
  ) {}

  @EventPattern('delete_message')
  async handleDeleteMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      await this.deleteMessageUseCase.execute(data);
      channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(error.message);
      channel.nack(originalMessage, false, false);
    }
  }
}
