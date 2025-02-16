import {
    Controller,
    Post,
    Body,
    Logger,
    Inject,
    Headers,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CreateMessageWithFileDto } from './dtos/create-message-with-file.dto';
  import { message } from '@message/ioc';
import { ICreateMessageWithFileUseCase } from '@message/use-cases/interfaces/create-message-with-file.interface';
  
  @Controller('messages')
  export class CreateMessageWithFileController {
    private readonly logger = new Logger(CreateMessageWithFileController.name);
  
    constructor(
      @Inject(message.useCases.createMessageWithFile)
      private readonly createMessageWithFileUseCase: ICreateMessageWithFileUseCase,
    ) {}
  
    @Post('with-file')
    @UseInterceptors(FileInterceptor('file'))
    async createMessageWithFile(
      @Body() payload: CreateMessageWithFileDto,
      @UploadedFile() file: Express.Multer.File,
      @Headers('X-User-Id') user: string,
    ): Promise<any> {
      if (!file) {
        throw new BadRequestException('File is required');
      }

      this.logger.log(`File uploaded: ${JSON.stringify(file.originalname)}`);

      await this.createMessageWithFileUseCase.execute({ ...payload, sender: user, file });
      return { message: 'Mensagem recebida' };
    }
  }
  