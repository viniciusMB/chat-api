import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { IChatKeyService } from '@chat/services/chat-key.inteface';


@Injectable()
export class ChatKeyService implements IChatKeyService {
  generateChatKey(userIds: string[], title?: string): string {
    const sortedIds = userIds.map(id => id.toString()).sort();
    const data = sortedIds.join('_') + (title ? `|${title}` : ''); // remover title

    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  }
}
