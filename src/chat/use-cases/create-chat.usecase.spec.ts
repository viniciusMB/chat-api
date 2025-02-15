import { CreateChatUseCase } from './create-chat.usecase';
import { ChatRepository } from '@chat/repositories/chat.repository';
import { IChatKeyService } from '@chat/services/chat-key.inteface';
import { ICreateChatMemberUseCase } from './interfaces/create-chat-member.interface';
import { CreateChatUseCaseInput } from './interfaces/create-chat.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';

describe('CreateChatUseCase', () => {
  let useCase: CreateChatUseCase;
  let chatRepository: Partial<ChatRepository>;
  let chatKeyService: Partial<IChatKeyService>;
  let createChatMemberUseCase: Partial<ICreateChatMemberUseCase>;

  beforeEach(() => {
    chatRepository = {
      findByChatKeyIncSeq: jest.fn(),
      create: jest.fn(),
    };

    chatKeyService = {
      generateChatKey: jest.fn(),
    };

    createChatMemberUseCase = {
      execute: jest.fn(),
    };

    useCase = new CreateChatUseCase(
      chatRepository as ChatRepository,
      chatKeyService as IChatKeyService,
      createChatMemberUseCase as ICreateChatMemberUseCase,
    );
  });

  it('should throw an error if chat type is not DIRECT', async () => {
    const input: CreateChatUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      title: 'Test Chat',
      type: ChatType.GROUP,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Invalid Chat Type!');
  });

  it('should return existing chat if found', async () => {
    const input: CreateChatUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      title: 'Test Chat',
      type: ChatType.DIRECT,
    };

    const chatKey = 'hashValue';
    const existingChat = { _id: 'chat1', chatKey, seq: 10, title: 'Test Chat', type: ChatType.DIRECT };

    (chatKeyService.generateChatKey as jest.Mock).mockReturnValue(chatKey);
    (chatRepository.findByChatKeyIncSeq as jest.Mock).mockResolvedValue(existingChat);

    const result = await useCase.execute(input);

    expect(chatKeyService.generateChatKey).toHaveBeenCalledWith([input.sender, input.receiver]);
    expect(chatRepository.findByChatKeyIncSeq).toHaveBeenCalledWith(chatKey);
    expect(chatRepository.create).not.toHaveBeenCalled();
    expect(createChatMemberUseCase.execute).not.toHaveBeenCalled();
    expect(result).toEqual(existingChat);
  });

  it('should create a new chat and chat members if no chat exists', async () => {
    const input: CreateChatUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      title: 'Test Chat',
      type: ChatType.DIRECT,
    };

    const chatKey = 'hashValue';
    (chatKeyService.generateChatKey as jest.Mock).mockReturnValue(chatKey);
    (chatRepository.findByChatKeyIncSeq as jest.Mock).mockResolvedValue(null);

    const createdChat = { _id: 'chat2', chatKey, seq: 1, title: input.title, type: ChatType.DIRECT };
    (chatRepository.create as jest.Mock).mockResolvedValue(createdChat);
    (createChatMemberUseCase.execute as jest.Mock).mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(chatKeyService.generateChatKey).toHaveBeenCalledWith([input.sender, input.receiver]);
    expect(chatRepository.findByChatKeyIncSeq).toHaveBeenCalledWith(chatKey);
    expect(chatRepository.create).toHaveBeenCalledWith({
      title: input.title,
      type: input.type,
      chatKey,
    });
    expect(createChatMemberUseCase.execute).toHaveBeenCalledTimes(2);
    expect(createChatMemberUseCase.execute).toHaveBeenNthCalledWith(1, { chat: chatKey, user: input.sender });
    expect(createChatMemberUseCase.execute).toHaveBeenNthCalledWith(2, { chat: chatKey, user: input.receiver });
    expect(result).toEqual(createdChat);
  });
});
