import { Message } from "@message/schemas/message.schema";

export interface DeleteMessageUseCaseInput {
    id: string;
    user: string
}

export interface IDeleteMessageUseCase {
    execute(input: DeleteMessageUseCaseInput): Promise<Message>
}