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
  import { ClientProxy } from '@nestjs/microservices';
  import { message } from '@message/ioc';
  
  @Controller('messages')
  export class CreateMessageWithFileController {
    private readonly logger = new Logger(CreateMessageWithFileController.name);
  
    constructor(
      @Inject('CREATE_MESSAGE_WITH_FILE_QUEUE')
      private readonly client: ClientProxy,
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
      const encodedFile = {
        buffer: file.buffer.toString('base64'),
        originalname: file.originalname,
        mimetype: file.mimetype,
      };
      const messageData = { ...payload, sender: user, file: encodedFile };
  
      this.logger.log(`Sending file message to queue: ${JSON.stringify({
        ...payload,
        sender: user,
        file: { originalname: file.originalname, mimetype: file.mimetype },
      })}`);
      this.client.emit('create_message_with_file', messageData);
      return { message: 'Mensagem recebida' };
    }
  }
  