import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { QUEUE_CLIENTS } from './queues'

export const createRabbitMQOptions = (configService: ConfigService): MicroserviceOptions[] => {
  const rabbitMQUrl = configService.get<string>('RABBITMQ_URL');

  return QUEUE_CLIENTS.map(({ queueEnv, dlqEnv }) => ({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: configService.get<string>(queueEnv),
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': configService.get<string>(dlqEnv),
        },
      },
      noAck: false,
    },
  }));
};
