import { CreateMessageUseCase } from './create-message.usecase';
import { MessageRepository } from '@message/repositories/message.repository';
import { ICreateChatUseCase } from '@chat/use-cases/interfaces/create-chat.interface';
import { CreateMessageUseCaseInput } from './interfaces/create-message.interface';
import { CreateMessageRepositoryInput } from '@message/repositories/message.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('CreateMessageUseCase', () => {
  let createMessageUseCase: CreateMessageUseCase;
  let messageRepository: Partial<MessageRepository>;
  let upsertChatUseCase: Partial<ICreateChatUseCase>;

  beforeEach(() => {
    messageRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    upsertChatUseCase = {
      execute: jest.fn(),
    };
    createMessageUseCase = new CreateMessageUseCase(
      messageRepository as MessageRepository,
      upsertChatUseCase as ICreateChatUseCase,
    );
  });

  it('should call upsertChatUseCase.execute and then messageRepository.create with transformed input when no reply is provided', async () => {
    const input: CreateMessageUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Hello, world!',
      status: 'active',
      type: ChatType.DIRECT,
    };

    const chatDocument = { chatKey: 'chatKeyValue', seq: 5 };
    (upsertChatUseCase.execute as jest.Mock).mockResolvedValue(chatDocument);

    const expectedRepoInput: CreateMessageRepositoryInput = {
      sender: input.sender,
      text: input.text,
      status: input.status,
      reply: undefined,
      receiver: chatDocument.chatKey,
      seq: chatDocument.seq,
    };

    const createdMessage = { _id: 'messageId', ...expectedRepoInput };
    (messageRepository.create as jest.Mock).mockResolvedValue(createdMessage);

    const result = await createMessageUseCase.execute(input);

    expect(upsertChatUseCase.execute).toHaveBeenCalledWith({
      sender: input.sender,
      receiver: input.receiver,
      type: input.type,
    });
    expect(messageRepository.create).toHaveBeenCalledWith(expectedRepoInput);
    expect(result).toEqual(createdMessage);
  });

  it('should throw a NotFoundException if replying to a non-existent message', async () => {
    const input: CreateMessageUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Reply message',
      status: 'active',
      type: ChatType.DIRECT,
      reply: 'nonExistentMessageId',
    };

    (messageRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(createMessageUseCase.execute(input))
      .rejects
      .toThrow(new NotFoundException("Message not found!"));

    expect(messageRepository.findById).toHaveBeenCalledWith(input.reply);
  });

  it('should process the reply if the replied message exists', async () => {
    const input: CreateMessageUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Reply message',
      status: 'active',
      type: ChatType.DIRECT,
      reply: 'existingMessageId',
    };

    const existingMessage = { _id: 'existingMessageId', text: 'Existing message', sender: 'user1' };
    (messageRepository.findById as jest.Mock).mockResolvedValue(existingMessage);

    const chatDocument = { chatKey: 'chatKeyValue', seq: 10 };
    (upsertChatUseCase.execute as jest.Mock).mockResolvedValue(chatDocument);

    const expectedRepoInput: CreateMessageRepositoryInput = {
      sender: input.sender,
      text: input.text,
      status: input.status,
      reply: input.reply,
      receiver: chatDocument.chatKey,
      seq: chatDocument.seq,
    };

    const createdMessage = { _id: 'newMessageId', ...expectedRepoInput };
    (messageRepository.create as jest.Mock).mockResolvedValue(createdMessage);

    const result = await createMessageUseCase.execute(input);

    expect(messageRepository.findById).toHaveBeenCalledWith(input.reply);
    expect(upsertChatUseCase.execute).toHaveBeenCalledWith({
      sender: input.sender,
      receiver: input.receiver,
      type: input.type,
    });
    expect(messageRepository.create).toHaveBeenCalledWith(expectedRepoInput);
    expect(result).toEqual(createdMessage);
  });
});
