import { MessageService } from './message.service';
import { MessageRepository } from '@message/repositories/message.repository';
import { ICreateChatUseCase } from '@chat/use-cases/interfaces/create-chat.interface';
import { CreateMessageAndChatInput } from './message.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';

describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: Partial<MessageRepository>;
  let upsertChatUseCase: Partial<ICreateChatUseCase>;

  beforeEach(() => {
    messageRepository = {
      create: jest.fn(),
    };
    upsertChatUseCase = {
      execute: jest.fn(),
    };
    messageService = new MessageService(
      messageRepository as MessageRepository,
      upsertChatUseCase as ICreateChatUseCase,
    );
  });

  it('should create a message and chat successfully without reply', async () => {
    const input: CreateMessageAndChatInput = {
      sender: 'user1',
      receiver: 'user2',
      type: ChatType.DIRECT,
      text: 'Hello, world!',
      status: 'active',
    };

    const chatDocument = {
      chatKey: 'chatKeyValue',
      seq: 5,
    };

    (upsertChatUseCase.execute as jest.Mock).mockResolvedValue(chatDocument);

    const expectedRepoInput = {
      sender: input.sender,
      text: input.text,
      status: input.status,
      reply: undefined,
      receiver: chatDocument.chatKey,
      seq: chatDocument.seq,
    };

    const createdMessage = { _id: 'messageId', ...expectedRepoInput };
    (messageRepository.create as jest.Mock).mockResolvedValue(createdMessage);

    const result = await messageService.createMessageAndChat(input);

    expect(upsertChatUseCase.execute).toHaveBeenCalledWith({
      sender: input.sender,
      receiver: input.receiver,
      type: input.type,
    });
    expect(messageRepository.create).toHaveBeenCalledWith(expectedRepoInput);
    expect(result).toEqual(createdMessage);
  });

  it('should create a message and chat successfully with reply', async () => {
    const input: CreateMessageAndChatInput = {
      sender: 'user1',
      receiver: 'user2',
      type: ChatType.DIRECT,
      text: 'Reply message',
      status: 'active',
      reply: 'existingMessageId',
    };

    const chatDocument = {
      chatKey: 'chatKeyValue',
      seq: 10,
    };

    (upsertChatUseCase.execute as jest.Mock).mockResolvedValue(chatDocument);

    const expectedRepoInput = {
      sender: input.sender,
      text: input.text,
      status: input.status,
      reply: input.reply,
      receiver: chatDocument.chatKey,
      seq: chatDocument.seq,
    };

    const createdMessage = { _id: 'newMessageId', ...expectedRepoInput };
    (messageRepository.create as jest.Mock).mockResolvedValue(createdMessage);

    const result = await messageService.createMessageAndChat(input);

    expect(upsertChatUseCase.execute).toHaveBeenCalledWith({
      sender: input.sender,
      receiver: input.receiver,
      type: input.type,
    });
    expect(messageRepository.create).toHaveBeenCalledWith(expectedRepoInput);
    expect(result).toEqual(createdMessage);
  });
});
