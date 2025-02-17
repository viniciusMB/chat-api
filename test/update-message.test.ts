import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, Logger } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';
import { createRabbitMQOptions } from '@common/rabbitmq/rabbitmq.config';

describe('UpdateMessageController Integration', () => {
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
    const collections = ['messages'];
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

  it('PUT /messages - updates a message successfully', async () => {
    const user = new Types.ObjectId().toHexString();
    const messageDoc = {
      sender: user,
      text: 'Original text',
      receiver: 'chatKey123',
      seq: 1,
    };
    const result = await connection.collection('messages').insertOne(messageDoc);
    const messageId = result.insertedId.toHexString();
    const payload = { id: messageId, text: 'Updated text' };

    await request(app.getHttpServer())
      .put('/messages')
      .set('X-User-Id', user)
      .send(payload)
      .expect(HttpStatus.OK)
      .expect({ message: 'Mensagem recebida' });

    await new Promise((resolve) => setTimeout(resolve, 100));
    const updatedMessage = await connection.collection('messages').findOne({ _id: result.insertedId });
    expect(updatedMessage).toBeDefined();
    expect(updatedMessage.text).toEqual('Updated text');
  });

  it('PUT /messages - logs error when message not found', async () => {
    const user = new Types.ObjectId().toHexString();
    const fakeId = new Types.ObjectId().toHexString();
    const payload = { id: fakeId, text: 'Updated text' };

    await request(app.getHttpServer())
      .put('/messages')
      .set('X-User-Id', user)
      .send(payload)
      .expect(HttpStatus.OK)
      .expect({ message: 'Mensagem recebida' });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Message not found!'),
      expect.any(String)
    );
  });
});
