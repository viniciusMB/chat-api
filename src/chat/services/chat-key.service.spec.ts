import { ChatKeyService } from './chat-key.service';

describe('ChatKeyService', () => {
  let chatKeyService: ChatKeyService;

  beforeEach(() => {
    chatKeyService = new ChatKeyService();
  });

  it('should generate the same chat key regardless of the order of userIds', () => {
    const userIds = ['user1', 'user2', 'user3'];
    const key1 = chatKeyService.generateChatKey(userIds);
    const key2 = chatKeyService.generateChatKey([...userIds].reverse());
    expect(key1).toEqual(key2);
  });

  it('should generate different chat keys when a title is provided', () => {
    const userIds = ['user1', 'user2'];
    const keyWithoutTitle = chatKeyService.generateChatKey(userIds);
    const keyWithTitle = chatKeyService.generateChatKey(userIds, 'MyGroup');
    expect(keyWithoutTitle).not.toEqual(keyWithTitle);
  });

  it('should return a valid SHA-256 hash string (64 hex characters)', () => {
    const userIds = ['user1', 'user2', 'user3'];
    const chatKey = chatKeyService.generateChatKey(userIds);
    expect(chatKey).toMatch(/^[a-f0-9]{64}$/);
  });
});
