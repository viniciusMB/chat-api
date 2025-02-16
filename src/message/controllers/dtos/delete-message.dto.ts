import { IsMongoId } from 'class-validator';

export class DeleteMessageDto {
  @IsMongoId({ message: 'Invalid ObjectId format for id' })
  id: string;

  @IsMongoId({ message: 'Invalid ObjectId format for user' })
  user: string;
}
