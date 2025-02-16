import { Inject, Injectable } from "@nestjs/common";
import { CreateMessageWithFileUseCaseInput, ICreateMessageWithFileUseCase } from "./interfaces/create-message-with-file.interface";
import { message } from "@message/ioc";
import { ICreateMessageUseCase } from "./interfaces/create-message.interface";
import { IReplyMessageUseCase } from "./interfaces/reply-message.interface";
import { bucket } from "@common/bucket/ioc";
import { IBucketRepository } from "@common/bucket/bucket.interface";

@Injectable()
export class CreateMessageWithFileUseCase implements ICreateMessageWithFileUseCase {
    constructor(
        @Inject(message.useCases.createMessage)
        private readonly createMessageUseCase: ICreateMessageUseCase,
        @Inject(message.useCases.replyMessage)
        private readonly replyMessageUseCase: IReplyMessageUseCase,
        @Inject(bucket.repository)
        private readonly buscketRepository: IBucketRepository
    ) {}

    async execute(input: CreateMessageWithFileUseCaseInput) {
        const { file, ...rest } = input;
        const { buffer, originalname: fileName, mimetype: contentType } = file;
        const { downloadUrl, key: filePath} = await this.buscketRepository.uploadFile(buffer, fileName, contentType);
      
        const messagePayload = {
          ...rest,
          file: {
            filePath,
            contentType,
            downloadUrl,
          },
        };
      
        if (!input.reply) {
          return this.createMessageUseCase.execute(messagePayload);
        }
        return this.replyMessageUseCase.execute(messagePayload);
      }
      
}