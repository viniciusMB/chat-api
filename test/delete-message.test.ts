import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { createRabbitMQOptions } from '@common/rabbitmq/rabbitmq.config';

describe('DeleteMessageController Integration', () => {
  let app: INestApplication;
  let connection: Connection;
  let loggerErrorSpy: jest.SpyInstance;

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

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');
  });

  beforeEach(async () => {
    const collections = ['messages', 'chatmembers', 'chats'];
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
    loggerErrorSpy.mockRestore();
  });

  it('DELETE /messages/:id - deletes a message when no reply exists', async () => {
    
    const user = new Types.ObjectId().toHexString();
    const messageDoc = {
      sender: user,
      text: 'Message to delete',
      receiver: 'chatKey123',
      seq: 1,
    };
    const result = await connection.collection('messages').insertOne(messageDoc);
    const messageId = result.insertedId.toHexString()

    await request(app.getHttpServer())
      .delete(`/messages/${messageId}`)
      .set('X-User-Id', user)
      .expect(HttpStatus.OK)
      .expect({ message: 'Message received' });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const found = await connection.collection('messages').findOne({ _id: result.insertedId });
    expect(found).toBeNull();
  });

  it('DELETE /messages/:id - returns error if message does not exist', async () => {
    const fakeId = new Types.ObjectId().toHexString();
    const user = new Types.ObjectId().toHexString();
    await request(app.getHttpServer())
      .delete(`/messages/${fakeId}`)
      .set('X-User-Id', user)
      .expect(HttpStatus.OK);
    
      await new Promise((resolve) => setTimeout(resolve, 500));
    
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Message not found!')
      );
  });

  it('DELETE /messages/:id - deletes all replies', async () => {
    const user = new Types.ObjectId().toHexString();
    const originalResult = await connection.collection('messages').insertOne({
      sender: user,
      text: 'Message to delete',
      receiver: 'chatKey123',
      seq: 1,
    });
    const messageId = originalResult.insertedId.toHexString();

    const user2 = new Types.ObjectId().toHexString();
    await connection.collection('messages').insertOne({
      sender: user2,
      text: 'Reply message',
      receiver: 'chatKey123',
      seq: 2,
      reply: messageId,
    });
    await request(app.getHttpServer())
      .delete(`/messages/${messageId}`)
      .set('X-User-Id', user)
      .expect(HttpStatus.OK);

    await new Promise((resolve) => setTimeout(resolve, 500));
    const found = await connection.collection('messages').findOne({ reply: messageId });
    expect(found).toBeNull()
  });
});
