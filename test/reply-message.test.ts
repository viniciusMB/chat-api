import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ChatType } from '@chat/schemas/chat-type.enum';
import { AppModule } from '../src/app.module';

describe('ReplyMessageController Integration', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    await app.init();
  
    connection = app.get(getConnectionToken());
  });
  
  beforeEach(async () => {
    const collections = ['chats', 'chatmembers', 'messages'];
    for (const name of collections) {
      if (!connection.collections[name]) {
        await connection.createCollection(name);
      }
    }
  });
  
  afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  it('POST /messages/reply - should create a reply message to an existing message', async () => {
    const originalPayload = {
      sender: 'user1',
      receiver: 'user2',
      text: 'Original message',
      status: 'active',
      type: ChatType.DIRECT,
    };

    await request(app.getHttpServer())
      .post('/messages/reply')
      .send(originalPayload)
      .expect(201)
      .expect({ message: 'Mensagem recebida' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const chatMembers = await connection
      .collection('chatmembers')
      .find({ user: { $in: [originalPayload.sender, originalPayload.receiver] } })
      .toArray();
      
    expect(chatMembers.length).toBe(2);
    const chatKey = chatMembers[0].chat;

    const originalMessage = await connection.collection('messages').findOne({
      sender: originalPayload.sender,
      text: originalPayload.text,
      receiver: chatKey,
    });
    expect(originalMessage).toBeDefined();
    expect(originalMessage.seq).toBe(1);

    const replyPayload = {
      sender: 'user2',
      receiver: 'user1',
      text: 'This is a reply message',
      status: 'active',
      type: ChatType.DIRECT,
      reply: originalMessage._id.toString(),
    };

    await request(app.getHttpServer())
      .post('/messages/reply')
      .send(replyPayload)
      .expect(201)
      .expect({ message: 'Mensagem recebida' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const updatedChat = await connection.collection('chats').findOne({ chatKey });
    expect(updatedChat).toBeDefined();
    expect(updatedChat.seq).toBe(2);

    const messages = await connection
      .collection('messages')
      .find({ receiver: chatKey })
      .sort({ seq: 1 })
      .toArray();
    expect(messages.length).toBe(2);
    expect(messages[0].seq).toBe(1);
    expect(messages[1].seq).toBe(2);
    expect(messages[1].reply.toString()).toEqual(originalMessage._id.toString());
  });
});
