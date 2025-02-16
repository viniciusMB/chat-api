import { ReplyMessageUseCase } from './reply-message.usecase';
import { MessageRepository } from '@message/repositories/message.repository';
import { IMessageService } from '@message/services/message.interface';
import { ReplyMessageUseCaseInput } from './interfaces/reply-message.interface';
import { NotFoundException } from '@nestjs/common';
import { ChatType } from '@chat/schemas/chat-type.enum';

describe('ReplyMessageUseCase', () => {
  let replyMessageUseCase: ReplyMessageUseCase;
  let messageRepository: Partial<MessageRepository>;
  let messageService: Partial<IMessageService>;

  beforeEach(() => {
    messageRepository = {
      findById: jest.fn(),
    };
    messageService = {
      createMessageAndChat: jest.fn(),
    };
    replyMessageUseCase = new ReplyMessageUseCase(
      messageRepository as MessageRepository,
      messageService as IMessageService,
    );
  });

  it('should throw a NotFoundException if the replied message does not exist', async () => {
    const input: ReplyMessageUseCaseInput = {
      reply: 'nonExistentMessageId',
      sender: 'user1',
      receiver: 'user2',
      text: 'This is a reply message',
      status: 'active',
      type: ChatType.DIRECT,
    };

    (messageRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(replyMessageUseCase.execute(input))
      .rejects
      .toThrow(new NotFoundException("Message not found!"));

    expect(messageRepository.findById).toHaveBeenCalledWith(input.reply);
  });

  it('should call messageService.createMessageAndChat if the replied message exists', async () => {
    const input: ReplyMessageUseCaseInput = {
      reply: 'existingMessageId',
      sender: 'user1',
      receiver: 'user2',
      text: 'This is a reply message',
      status: 'active',
      type: ChatType.DIRECT,
    };

    const existingMessage = {
      _id: input.reply,
      sender: 'user1',
      text: 'Original message',
    };

    (messageRepository.findById as jest.Mock).mockResolvedValue(existingMessage);

    const createdMessage = { _id: 'newMessageId', ...input };
    (messageService.createMessageAndChat as jest.Mock).mockResolvedValue(createdMessage);

    const result = await replyMessageUseCase.execute(input);

    expect(messageRepository.findById).toHaveBeenCalledWith(input.reply);
    expect(messageService.createMessageAndChat).toHaveBeenCalledWith(input);
    expect(result).toEqual(createdMessage);
  });
});
