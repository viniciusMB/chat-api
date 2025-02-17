import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createRabbitMQOptions } from '@common/rabbitmq/rabbitmq.config';
import { createDLQs } from '@common/rabbitmq/create-dlqs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const microserviceOptions = createRabbitMQOptions(configService);

  microserviceOptions.forEach((options) => {
    app.connectMicroservice(options);
  });

  await app.startAllMicroservices()

  await createDLQs()
  await app.listen(3000);

}
bootstrap();
