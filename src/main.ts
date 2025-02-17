import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await createDLQs()

  const config = new DocumentBuilder()
    .setTitle('chat-api')
    .setDescription('The chat-api API description')
    .setVersion('1.0')
    .addGlobalParameters({
      in: 'header',
      name: 'x-request-id',
      description:
        'Optional parameter, to improve traceability, if not informed a uuid v4 will be created',
      required: false,
      schema: { example: 'id|uuid|ooid' },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices()
  await app.listen(3000);

}
bootstrap();
