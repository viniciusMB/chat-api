import { CreateMessageUseCase } from './create-message.usecase';
import { MessageRepository } from '@message/repositories/message.repository';
import { ICreateChatUseCase } from '@chat/use-cases/interfaces/create-chat.interface';
import { CreateMessageUseCaseInput } from './create-message.interface';
import { CreateMessageRepositoryInput } from '@message/repositories/message.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';

describe('CreateMessageUseCase', () => {
  let createMessageUseCase: CreateMessageUseCase;
  let messageRepository: Partial<MessageRepository>;
  let upsertChatUseCase: Partial<ICreateChatUseCase>;

  beforeEach(() => {
    messageRepository = {
      create: jest.fn(),
    };
    upsertChatUseCase = {
      execute: jest.fn(),
    };
    createMessageUseCase = new CreateMessageUseCase(
      messageRepository as MessageRepository,
      upsertChatUseCase as ICreateChatUseCase,
    );
  });

  it('should call upsertChatUseCase.execute and then messageRepository.create with transformed input', async () => {
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
});
