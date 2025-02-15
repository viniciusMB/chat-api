import { ChatType } from '@chat/schemas/chat-type.enum';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

export class ReplyMessageDto extends CreateMessageDto {

  @IsString()
  reply: string;
}