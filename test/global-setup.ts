const { MongoMemoryServer } = require('mongodb-memory-server');
const { GenericContainer } = require('testcontainers');
const { S3Client, CreateBucketCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

module.exports = async () => {
  // Inicia o MongoDB em memória
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  global.__MONGO_SERVER__ = mongoServer;

  // Inicia o LocalStack para S3 via Testcontainers
  const localstackContainer = await new GenericContainer('localstack/localstack')
    .withEnvironment({
      SERVICES: 's3',
      DEFAULT_REGION: 'us-east-1',
    })
    .withExposedPorts(4566)
    .start();

  const mappedPort = localstackContainer.getMappedPort(4566);
  const containerHost = localstackContainer.getHost();

  process.env.AWS_S3_ENDPOINT = `http://${containerHost}:${mappedPort}`;
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_ACCESS_KEY_ID = 'test';
  process.env.AWS_SECRET_ACCESS_KEY = 'test';
  process.env.AWS_S3_BUCKET = 'mybucket';
  process.env.AWS_FORCE_PATH_STYLE = 'true';

  global.__LOCALSTACK_CONTAINER__ = localstackContainer;

  // Cria o bucket no LocalStack utilizando o AWS SDK
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: process.env.AWS_FORCE_PATH_STYLE === 'true',
  });
  
  try {
    await s3Client.send(new CreateBucketCommand({ Bucket: process.env.AWS_S3_BUCKET }));
    console.log(`Bucket ${process.env.AWS_S3_BUCKET} created successfully.`);
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
};
