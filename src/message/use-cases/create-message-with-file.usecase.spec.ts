import { CreateMessageWithFileUseCase } from './create-message-with-file.usecase';
import { ICreateMessageUseCase } from './interfaces/create-message.interface';
import { IReplyMessageUseCase } from './interfaces/reply-message.interface';
import { IBucketRepository } from '@common/bucket/bucket.interface';
import { CreateMessageWithFileUseCaseInput } from './interfaces/create-message-with-file.interface';
import { ChatType } from '@chat/schemas/chat-type.enum';

describe('CreateMessageWithFileUseCase', () => {
  let useCase: CreateMessageWithFileUseCase;
  let createMessageUseCase: Partial<ICreateMessageUseCase>;
  let replyMessageUseCase: Partial<IReplyMessageUseCase>;
  let bucketRepository: Partial<IBucketRepository>;

  beforeEach(() => {
    createMessageUseCase = { execute: jest.fn() };
    replyMessageUseCase = { execute: jest.fn() };
    bucketRepository = { uploadFile: jest.fn() };

    useCase = new CreateMessageWithFileUseCase(
      createMessageUseCase as ICreateMessageUseCase,
      replyMessageUseCase as IReplyMessageUseCase,
      bucketRepository as IBucketRepository
    );
  });

  it('should call createMessageUseCase.execute when no reply is provided', async () => {
    const fakeFile = {
      buffer: Buffer.from('file content'),
      originalname: 'test.txt',
      mimetype: 'text/plain'
    };

    const input: CreateMessageWithFileUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Message with file',
      status: 'active',
      type: ChatType.DIRECT,
      title: 'Title',
      file: fakeFile as Express.Multer.File
    };

    const uploadResponse = { downloadUrl: 'http://download-url', key: 'filePath123' };
    (bucketRepository.uploadFile as jest.Mock).mockResolvedValue(uploadResponse);

    const expectedPayload = {
      sender: input.sender,
      receiver: input.receiver,
      text: input.text,
      status: input.status,
      type: input.type,
      title: input.title,
      file: {
        filePath: uploadResponse.key,
        contentType: fakeFile.mimetype,
        downloadUrl: uploadResponse.downloadUrl,
      }
    };

    const createdMessage = { _id: 'messageId', ...expectedPayload };
    (createMessageUseCase.execute as jest.Mock).mockResolvedValue(createdMessage);

    const result = await useCase.execute(input);

    expect(bucketRepository.uploadFile).toHaveBeenCalledWith(
      fakeFile.buffer,
      fakeFile.originalname,
      fakeFile.mimetype
    );
    expect(createMessageUseCase.execute).toHaveBeenCalledWith(expectedPayload);
    expect(result).toEqual(createdMessage);
    expect(replyMessageUseCase.execute).not.toHaveBeenCalled();
  });

  it('should call replyMessageUseCase.execute when reply is provided', async () => {
    const fakeFile = {
      buffer: Buffer.from('file content'),
      originalname: 'reply.txt',
      mimetype: 'text/plain'
    };

    const input: CreateMessageWithFileUseCaseInput = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Reply message with file',
      status: 'active',
      type: ChatType.DIRECT,
      title: 'Title',
      reply: 'existingMessageId',
      file: fakeFile as Express.Multer.File
    };

    const uploadResponse = { downloadUrl: 'http://reply-download-url', key: 'replyFilePath123' };
    (bucketRepository.uploadFile as jest.Mock).mockResolvedValue(uploadResponse);

    const expectedPayload = {
      sender: input.sender,
      receiver: input.receiver,
      text: input.text,
      status: input.status,
      type: input.type,
      title: input.title,
      reply: input.reply,
      file: {
        filePath: uploadResponse.key,
        contentType: fakeFile.mimetype,
        downloadUrl: uploadResponse.downloadUrl,
      }
    };

    const createdReplyMessage = { _id: 'replyMessageId', ...expectedPayload };
    (replyMessageUseCase.execute as jest.Mock).mockResolvedValue(createdReplyMessage);

    const result = await useCase.execute(input);

    expect(bucketRepository.uploadFile).toHaveBeenCalledWith(
      fakeFile.buffer,
      fakeFile.originalname,
      fakeFile.mimetype
    );
    expect(replyMessageUseCase.execute).toHaveBeenCalledWith(expectedPayload);
    expect(result).toEqual(createdReplyMessage);
    expect(createMessageUseCase.execute).not.toHaveBeenCalled();
  });
});
