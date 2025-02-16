import { ChatType } from '@chat/schemas/chat-type.enum';
import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId({ message: 'Invalid ObjectId format for receiver' })
  receiver: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsEnum(ChatType)
  type?: ChatType;

  @IsOptional()
  @IsString()
  title?: string;
}