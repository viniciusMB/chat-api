import { CreateMessageUseCase } from './create-message.usecase';
import { IMessageService } from '@message/services/message.interface';
import { CreateMessageUseCaseInput } from './interfaces/create-message.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('CreateMessageUseCase', () => {
  let createMessageUseCase: CreateMessageUseCase;
  let messageService: Partial<IMessageService>;

  beforeEach(() => {
    messageService = {
      createMessageAndChat: jest.fn(),
    };
    createMessageUseCase = new CreateMessageUseCase(messageService as IMessageService);
  });

  it('should call messageService.createMessageAndChat with the given input and return its result', async () => {
    const input: CreateMessageUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Hello, world!',
      status: 'active',
      type: ChatType.DIRECT,
    };

    const expectedResult = { _id: 'messageId', ...input };
    (messageService.createMessageAndChat as jest.Mock).mockResolvedValue(expectedResult);

    const result = await createMessageUseCase.execute(input);

    expect(messageService.createMessageAndChat).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });

  it('should propagate error thrown by messageService.createMessageAndChat', async () => {
    const input: CreateMessageUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Hello, world!',
      status: 'active',
      type: ChatType.DIRECT,
    };

    (messageService.createMessageAndChat as jest.Mock).mockRejectedValue(new NotFoundException('Message not found!'));

    await expect(createMessageUseCase.execute(input))
      .rejects
      .toThrow(new NotFoundException('Message not found!'));
  });
});
