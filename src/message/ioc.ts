export const message = {
    useCases: {
        createMessage: Symbol.for('CreateMessageUseCase'),
        updateMessage: Symbol.for('UpdateMessageUseCase'),
        createMessageWithFile: Symbol.for("CreateMessageWithFileUseCase"),
        replyMessage: Symbol.for("ReplyMessageUseCase"),
        deleteMessage: Symbol.for('DeleteMessageUseCase')
    },
    services: {
        message: Symbol.for("MessageService")
    },
    repositories: {
        message: Symbol.for("MessageRepository")
    }
}