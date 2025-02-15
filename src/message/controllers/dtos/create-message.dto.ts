import { ChatType } from '@chat/schemas/chat-type.enum';
import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  sender: string;

  @IsString()
  receiver: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  isReply?: boolean;

  @IsOptional()
  @IsString()
  reply?: string;

  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsString()
  title?: string;
}