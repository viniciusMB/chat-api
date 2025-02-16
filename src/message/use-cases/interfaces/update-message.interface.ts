import { Message } from "@message/schemas/message.schema";

export interface UpdateMessageUseCaseInput {
    text: string;
    id: string;
    user: string;
}

export interface IUpdateMessageUseCase {
    execute(input: UpdateMessageUseCaseInput): Promise<Message>
}