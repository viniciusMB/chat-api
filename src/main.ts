import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

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

  await app.listen(3000);

}
bootstrap();
