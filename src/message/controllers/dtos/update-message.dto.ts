import { IsMongoId, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsMongoId()
  id: string;

  @IsString()
  text: string;
}