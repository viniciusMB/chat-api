import { Module } from '@nestjs/common';
import { bucket } from './ioc';
import { BucketRepository } from './bucket.repository';
@Module({
  imports: [],
  controllers: [],
  providers: [{ provide: bucket.repository, useClass: BucketRepository }],
  exports: [bucket.repository]
})
export class BucketModule {}
