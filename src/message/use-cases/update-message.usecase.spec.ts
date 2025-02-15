import { UpdateMessageUseCase } from './update-message.usecase';
import { MessageRepository } from '@message/repositories/message.repository';
import { UpdateMessageUseCaseInput } from './interfaces/update-message.interface';

describe('UpdateMessageUseCase', () => {
  let updateMessageUseCase: UpdateMessageUseCase;
  let messageRepository: Partial<MessageRepository>;

  beforeEach(() => {
    messageRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    updateMessageUseCase = new UpdateMessageUseCase(messageRepository as MessageRepository);
  });

  it('should throw an error if the message does not exist', async () => {
    const input: UpdateMessageUseCaseInput = {
      id: 'nonExistingId',
      text: 'Updated text',
    };

    (messageRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateMessageUseCase.execute(input))
      .rejects
      .toThrow("You cannot edit a message that does not exist");
    
    expect(messageRepository.findById).toHaveBeenCalledWith(input.id);
  });

  it('should update the message text if the message exists', async () => {
    const input: UpdateMessageUseCaseInput = {
      id: 'existingId',
      text: 'Updated text',
    };

    const existingMessage = { _id: input.id, text: 'Old text' };
    (messageRepository.findById as jest.Mock).mockResolvedValue(existingMessage);

    const updatedMessage = { ...existingMessage, text: input.text };
    (messageRepository.update as jest.Mock).mockResolvedValue(updatedMessage);

    const result = await updateMessageUseCase.execute(input);

    expect(messageRepository.findById).toHaveBeenCalledWith(input.id);
    expect(messageRepository.update).toHaveBeenCalledWith(input.id, { text: input.text });
    expect(result).toEqual(updatedMessage);
  });
});
