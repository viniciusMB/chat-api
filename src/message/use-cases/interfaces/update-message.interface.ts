import { Message } from "@message/schemas/message.schema";

export interface UpdateMessageUseCaseInput {
    text: string;
    id: string;
}

export interface IUpdateMessageUseCase {
    execute(input: UpdateMessageUseCaseInput): Promise<Message>
}