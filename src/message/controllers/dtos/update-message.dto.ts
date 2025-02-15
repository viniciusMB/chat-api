import { IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}