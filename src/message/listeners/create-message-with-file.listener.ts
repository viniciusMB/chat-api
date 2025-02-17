import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ICreateMessageWithFileUseCase } from '@message/use-cases/interfaces/create-message-with-file.interface';
import { message } from '@message/ioc';

@Controller()
export class CreateMessageWithFileListener {
  private readonly logger = new Logger(CreateMessageWithFileListener.name);

  constructor(
    @Inject(message.useCases.createMessageWithFile)
    private readonly createMessageWithFileUseCase: ICreateMessageWithFileUseCase,
  ) {}

  @EventPattern('create_message_with_file')
  async handleMessage(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      if (data.file && data.file.buffer) {
        data.file.buffer = Buffer.from(data.file.buffer, 'base64');
      }
      await this.createMessageWithFileUseCase.execute(data);
      channel.ack(originalMessage)
    } catch (error) {
      this.logger.error(error.message);
      channel.nack(originalMessage, false, false);
    }
  }
}
