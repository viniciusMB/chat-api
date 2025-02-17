import * as amqp from 'amqplib';

export async function createDLQs() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  const queues = [
    process.env.CREATE_MESSAGE_QUEUE_DLQ_NAME,
    process.env.REPLY_MESSAGE_QUEUE_DLQ_NAME,
    process.env.DELETE_MESSAGE_QUEUE_DLQ_NAME,
    process.env.UPDATE_MESSAGE_QUEUE_DLQ_NAME,
    process.env.CREATE_MESSAGE_WITH_FILE_QUEUE_DLQ_NAME,
  ];

  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });
  }

  console.log('Filas DLQ criadas (sem consumidor)!');
  await channel.close();
  await connection.close();
}
