import { CreateChatMemberUseCase } from './create-chat-member.usecase';
import { ChatMemberRepository } from '@chat/repositories/chat-member.repository';
import { CreateChatMemberUseCaseInput } from '@chat/use-cases/interfaces/create-chat-member.interface';

describe('CreateChatMemberUseCase', () => {
  let useCase: CreateChatMemberUseCase;
  let chatMemberRepository: Partial<ChatMemberRepository>;

  beforeEach(() => {
    chatMemberRepository = {
      create: jest.fn(),
    };
    useCase = new CreateChatMemberUseCase(chatMemberRepository as ChatMemberRepository);
  });

  it('should call ChatMemberRepository.create with correct input and return its result', async () => {
    const input: CreateChatMemberUseCaseInput = { chat: 'chatId', user: 'userId' };
    const expectedResult = { _id: '123', ...input };

    (chatMemberRepository.create as jest.Mock).mockResolvedValue(expectedResult);
    
    await useCase.execute(input);

    expect(chatMemberRepository.create).toHaveBeenCalledWith(input);
  });
});
