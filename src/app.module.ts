import { MessageModule } from '@message/message.module';
import { ChatModule } from '@chat/chat.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketModule } from '@common/bucket/bucket.module';
import { RabbitMQModule } from '@common/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    RabbitMQModule.register(),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    ChatModule,
    MessageModule,
    BucketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
