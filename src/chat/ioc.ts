export const chat = {
    services: { chatKey: Symbol.for('ChatKeyService') },
    useCases: { 
        createChat: Symbol.for('CreateChatUseCase'),
        createChatMember: Symbol.for('CreateChatMemberUseCase')
    }
}