import { DynamicModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport, RmqOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUE_CLIENTS } from './queues';

@Global()
@Module({
  imports: [ConfigModule],
})
export class RabbitMQModule {
  static register(): DynamicModule {
    const clients = QUEUE_CLIENTS.map(queueClient => ({
      name: queueClient.name,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RmqOptions => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queue: configService.get<string>(queueClient.queueEnv),
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': configService.get<string>(queueClient.dlqEnv),
            },
          },
        },
      }),
    }));

    return {
      module: RabbitMQModule,
      imports: [ClientsModule.registerAsync(clients)],
      exports: [ClientsModule],
    };
  }
}
