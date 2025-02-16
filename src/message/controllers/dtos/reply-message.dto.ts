import { IsMongoId } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

export class ReplyMessageDto extends CreateMessageDto {

  @IsMongoId()
  reply: string;
}