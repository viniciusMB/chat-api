import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { ChatType } from '@chat/schemas/chat-type.enum';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';
import { bucket } from '@common/bucket/ioc';
import { IBucketRepository } from '@common/bucket/bucket.interface';

describe('CreateMessageWithFileController Integration', () => {
  let app: INestApplication;
  let connection: Connection;
  let bucketRepository: IBucketRepository;
  const fixturesDir = path.join(__dirname, 'fixtures');

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    connection = app.get(getConnectionToken());
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir);
    }
    bucketRepository = app.get(bucket.repository);
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

  it('POST /messages/with-file - should create a message with file info and return a valid download link', async () => {
    const payload = {
      receiver: 'user2',
      text: 'Message with file upload',
      status: 'active',
      type: ChatType.DIRECT,
      title: 'Chat with file'
    };

    const fileContent = 'dummy file content for testing';
    const fileName = 'test.txt';
    const filePath = path.join(fixturesDir, fileName);
    fs.writeFileSync(filePath, fileContent);

    await request(app.getHttpServer())
      .post('/messages/with-file')
      .set('X-User-Id', 'user1')
      .field('receiver', payload.receiver)
      .field('text', payload.text)
      .field('status', payload.status)
      .field('type', payload.type)
      .field('title', payload.title)
      .attach('file', filePath)
      .expect(HttpStatus.CREATED)
      .expect({ message: 'Mensagem recebida' });

    fs.unlinkSync(filePath);

    await new Promise(resolve => setTimeout(resolve, 100));

    const messageDoc = await connection.collection('messages').findOne({
      sender: 'user1',
      text: payload.text,
    });
    expect(messageDoc).toBeDefined();
    expect(messageDoc.file).toBeDefined();
    expect(messageDoc.file.downloadUrl).toBeDefined();
    expect(messageDoc.file.filePath).toBeDefined();
    expect(messageDoc.file.contentType).toBeDefined();

    const downloadUrl = messageDoc.file.downloadUrl;
    const fileResponse = await request(downloadUrl)
      .get('')
      .expect(HttpStatus.OK);
    expect(fileResponse.text).toEqual(fileContent);
  });

  it('POST /messages/with-file - should handle a conversation with multiple messages including file uploads', async () => {
    const payload1 = {
      receiver: 'user2',
      text: 'First message with file',
      status: 'active',
      type: ChatType.DIRECT,
      title: 'Chat multi'
    };
    const payload2 = {
      receiver: 'user1',
      text: 'Reply from user2 with file',
      status: 'active',
      type: ChatType.DIRECT,
    };
    const payload3 = {
      receiver: 'user2',
      text: 'Second message from user1 with file',
      status: 'active',
      type: ChatType.DIRECT,
    };

    const file1Path = path.join(fixturesDir, 'file1.txt');
    const file2Path = path.join(fixturesDir, 'file2.txt');
    const file3Path = path.join(fixturesDir, 'file3.txt');
    const content1 = 'Content of file 1';
    const content2 = 'Content of file 2';
    const content3 = 'Content of file 3';
    fs.writeFileSync(file1Path, content1);
    fs.writeFileSync(file2Path, content2);
    fs.writeFileSync(file3Path, content3);

    await request(app.getHttpServer())
      .post('/messages/with-file')
      .set('X-User-Id', 'user1')
      .field('receiver', payload1.receiver)
      .field('text', payload1.text)
      .field('status', payload1.status)
      .field('type', payload1.type)
      .field('title', payload1.title)
      .attach('file', file1Path)
      .expect(HttpStatus.CREATED)
      .expect({ message: 'Mensagem recebida' });

    await request(app.getHttpServer())
      .post('/messages/with-file')
      .set('X-User-Id', 'user2')
      .field('receiver', payload2.receiver)
      .field('text', payload2.text)
      .field('status', payload2.status)
      .field('type', payload2.type)
      .attach('file', file2Path)
      .expect(HttpStatus.CREATED)
      .expect({ message: 'Mensagem recebida' });

    await request(app.getHttpServer())
      .post('/messages/with-file')
      .set('X-User-Id', 'user1')
      .field('receiver', payload3.receiver)
      .field('text', payload3.text)
      .field('status', payload3.status)
      .field('type', payload3.type)
      .attach('file', file3Path)
      .expect(HttpStatus.CREATED)
      .expect({ message: 'Mensagem recebida' });

    fs.unlinkSync(file1Path);
    fs.unlinkSync(file2Path);
    fs.unlinkSync(file3Path);

    await new Promise(resolve => setTimeout(resolve, 100));

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
    messages.forEach(msg => {
      expect(msg.file).toBeDefined();
      expect(msg.file.filePath).toBeDefined();
      expect(msg.file.contentType).toBeDefined();
      expect(msg.file.downloadUrl).toBeDefined();
    });

    const downloaded1 = await request(messages[0].file.downloadUrl)
      .get('')
      .expect(HttpStatus.OK);
    const downloaded2 = await request(messages[1].file.downloadUrl)
      .get('')
      .expect(HttpStatus.OK);
    const downloaded3 = await request(messages[2].file.downloadUrl)
      .get('')
      .expect(HttpStatus.OK);
    expect(downloaded1.text).toEqual(content1);
    expect(downloaded2.text).toEqual(content2);
    expect(downloaded3.text).toEqual(content3);
  });

  it('should upload a file and download it successfully', async () => {
    const fileContent = 'Test file content for download verification';
    const fileBuffer = Buffer.from(fileContent);
    const fileName = 'download-test.txt';
    const contentType = 'text/plain';

    const uploadResponse = await bucketRepository.uploadFile(fileBuffer, fileName, contentType);
    expect(uploadResponse).toHaveProperty('downloadUrl');
    expect(uploadResponse).toHaveProperty('key');

    const res = await request(uploadResponse.downloadUrl).get('').expect(HttpStatus.OK);
    expect(res.text).toEqual(fileContent);
  });
});
