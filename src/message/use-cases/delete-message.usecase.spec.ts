import { DeleteMessageUseCase } from './delete-message.usecase';
import { MessageRepository } from '@message/repositories/message.repository';
import { DeleteMessageUseCaseInput } from './interfaces/delete-message.interface';

describe('DeleteMessageUseCase', () => {
  let useCase: DeleteMessageUseCase;
  let messageRepository: Partial<MessageRepository>;

  beforeEach(() => {
    messageRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteMessageUseCase(messageRepository as MessageRepository);
  });

  it('should delete the message if it exists and the user is the sender', async () => {
    const input: DeleteMessageUseCaseInput = { id: 'message1', user: 'user1' };
    const existingMessage = { _id: 'message1', sender: 'user1', text: 'Hello' };
    const deletedMessage = { _id: 'message1', sender: 'user1', text: 'Hello' };

    (messageRepository.findById as jest.Mock).mockResolvedValue(existingMessage);
    (messageRepository.delete as jest.Mock).mockResolvedValue(deletedMessage);

    const result = await useCase.execute(input);

    expect(messageRepository.findById).toHaveBeenCalledWith('message1');
    expect(messageRepository.delete).toHaveBeenCalledWith('message1');
    expect(result).toEqual(deletedMessage);
  });

  it('should throw an error if the message does not exist', async () => {
    const input: DeleteMessageUseCaseInput = { id: 'message1', user: 'user1' };

    (messageRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Message not found!');
    expect(messageRepository.findById).toHaveBeenCalledWith('message1');
  });

  it('should throw an error if the user is not the sender of the message', async () => {
    const input: DeleteMessageUseCaseInput = { id: 'message1', user: 'user2' };
    const existingMessage = { _id: 'message1', sender: 'user1', text: 'Hello' };

    (messageRepository.findById as jest.Mock).mockResolvedValue(existingMessage);

    await expect(useCase.execute(input)).rejects.toThrow('Message not found!');
    expect(messageRepository.findById).toHaveBeenCalledWith('message1');
  });
});
