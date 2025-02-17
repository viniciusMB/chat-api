const { MongoMemoryServer } = require('mongodb-memory-server');
const { GenericContainer } = require('testcontainers');
const { S3Client, CreateBucketCommand } = require('@aws-sdk/client-s3');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  global.__MONGO_SERVER__ = mongoServer;

  const localstackContainer = await new GenericContainer('localstack/localstack')
    .withEnvironment({
      SERVICES: 's3',
      DEFAULT_REGION: 'us-east-1',
    })
    .withExposedPorts(4566)
    .start();

  const localstackPort = localstackContainer.getMappedPort(4566);
  const localstackHost = localstackContainer.getHost();

  process.env.AWS_S3_ENDPOINT = `http://${localstackHost}:${localstackPort}`;
  process.env.AWS_REGION = 'us-east-1';
  process.env.AWS_ACCESS_KEY_ID = 'test';
  process.env.AWS_SECRET_ACCESS_KEY = 'test';
  process.env.AWS_S3_BUCKET = 'mybucket';
  process.env.AWS_FORCE_PATH_STYLE = 'true';

  global.__LOCALSTACK_CONTAINER__ = localstackContainer;

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

  const rabbitMQContainer = await new GenericContainer('rabbitmq:3-management')
    .withEnvironment('RABBITMQ_DEFAULT_USER', 'guest')
    .withEnvironment('RABBITMQ_DEFAULT_PASS', 'guest')
    .withExposedPorts(5672, 15672)
    .start();

  const rabbitMQPort = rabbitMQContainer.getMappedPort(5672);
  const rabbitMQHost = rabbitMQContainer.getHost();

  process.env.RABBITMQ_URL = `amqp://guest:guest@${rabbitMQHost}:${rabbitMQPort}`;
  process.env.CREATE_MESSAGE_QUEUE_NAME="create_message_queue"
  process.env.CREATE_MESSAGE_QUEUE_DLQ_NAME="create_message_queue_dlq"

  process.env.REPLY_MESSAGE_QUEUE_NAME="reply_message_queue"
  process.env.REPLY_MESSAGE_QUEUE_DLQ_NAME="reply_message_queue_dlq"

  process.env.DELETE_MESSAGE_QUEUE_NAME="delete_message_queue"
  process.env.DELETE_MESSAGE_QUEUE_DLQ_NAME="delete_message_queue_dlq"

  process.env.UPDATE_MESSAGE_QUEUE_NAME="update_message_queue"
  process.env.UPDATE_MESSAGE_QUEUE_DLQ_NAME="update_message_queue_dlq"
  
  process.env.CREATE_MESSAGE_WITH_FILE_QUEUE_NAME="file_upload_queue"
  process.env.CREATE_MESSAGE_WITH_FILE_QUEUE_DLQ_NAME="file_upload_queue_dlq"
  global.__RABBITMQ_CONTAINER__ = rabbitMQContainer;

  console.log(`RabbitMQ iniciado em ${process.env.RABBITMQ_URL}`);
};
