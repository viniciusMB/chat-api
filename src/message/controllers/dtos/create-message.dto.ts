import { ChatType } from '@chat/schemas/chat-type.enum';
import { IsString, IsOptional, IsEnum, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId({ message: 'Invalid ObjectId format for id' })
  sender: string;

  @IsMongoId({ message: 'Invalid ObjectId format for id' })
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