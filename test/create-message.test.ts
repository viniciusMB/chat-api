import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ChatType } from '@chat/schemas/chat-type.enum';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { createRabbitMQOptions } from '@common/rabbitmq/rabbitmq.config';

describe('CreateMessageController Integration', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    const configService = app.get(ConfigService);
    
    const microserviceOptions = createRabbitMQOptions(configService);

    microserviceOptions.forEach((options) => {
      app.connectMicroservice(options);
    });
    await app.startAllMicroservices();
    
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

  it('POST /messages - should create a chat, two chat members, a message and increment chat seq if it is the first message', async () => {
    const payload = {
      receiver: 'user2',
      text: 'Hello, this is the first message',
      status: 'active',
      type: ChatType.DIRECT,
    };

    await request(app.getHttpServer())
      .post('/messages')
      .set('X-User-Id', 'user1')
      .send(payload)
      .expect(201)
      .expect({ message: 'Message received' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const chatMembers = await connection
      .collection('chatmembers')
      .find({ user: { $in: ['user1', payload.receiver] } })
      .toArray();
    expect(chatMembers.length).toBe(2);
    const chatKey = chatMembers[0].chat;
    expect(chatMembers[0].chat).toEqual(chatMembers[1].chat);

    const chat = await connection.collection('chats').findOne({ chatKey });
    expect(chat).toBeDefined();
    expect(typeof chat.seq).toBe('number');

    const message = await connection.collection('messages').findOne({
      sender: 'user1',
      text: payload.text,
      receiver: chatKey
    });
    expect(message).toBeDefined();
    expect(message.seq).toEqual(chat.seq);
  });

  it('POST /messages - should handle a conversation between two users with 3 interleaved messages', async () => {
    const payload1 = {
      receiver: 'user2',
      text: 'Hello, this is the first message',
      status: 'active',
      type: ChatType.DIRECT,
    };
    const payload2 = {
      receiver: 'user1',
      text: 'Hi, this is the reply from user2',
      status: 'active',
      type: ChatType.DIRECT,
    };
    const payload3 = {
      receiver: 'user2',
      text: 'Hello again, third message',
      status: 'active',
      type: ChatType.DIRECT,
    };

    await request(app.getHttpServer())
      .post('/messages')
      .set('X-User-Id', 'user1')
      .send(payload1)
      .expect(201)
      .expect({ message: 'Message received' });

    await request(app.getHttpServer())
      .post('/messages')
      .set('X-User-Id', 'user2')
      .send(payload2)
      .expect(201)
      .expect({ message: 'Message received' });

    await request(app.getHttpServer())
      .post('/messages')
      .set('X-User-Id', 'user1')
      .send(payload3)
      .expect(201)
      .expect({ message: 'Message received' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const chatMembers = await connection
      .collection('chatmembers')
      .find({ user: { $in: ['user1', 'user2'] } })
      .toArray();
    expect(chatMembers.length).toBe(2);
    const chatKey = chatMembers[0].chat;
    expect(chatMembers[0].chat).toEqual(chatMembers[1].chat);

    const chat = await connection.collection('chats').findOne({ chatKey });
    expect(chat).toBeDefined();
    expect(chat.seq).toBe(3);

    const messages = await connection
      .collection('messages')
      .find({ receiver: chatKey })
      .sort({ seq: 1 })
      .toArray();
    expect(messages.length).toBe(3);
    expect(messages[0].sender).toBe('user1');
    expect(messages[1].sender).toBe('user2');
    expect(messages[2].sender).toBe('user1');
    expect(messages[0].seq).toBe(1);
    expect(messages[1].seq).toBe(2);
    expect(messages[2].seq).toBe(3);
  });
});
