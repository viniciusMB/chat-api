import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IBucketRepository } from './bucket.interface';

export interface FileUploadResponse {
  key: string;
  downloadUrl: string;
}

@Injectable()
export class BucketRepository implements IBucketRepository {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(BucketRepository.name);

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET;
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.AWS_S3_ENDPOINT,
      forcePathStyle: true,
    });
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket "${this.bucket}" already exists.`);
    } catch (error) {
      if (error.name === 'NotFound' || error.name === 'NoSuchBucket') {
        this.logger.warn(`Bucket "${this.bucket}" Not found. Creating Bucket...`);
        await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket "${this.bucket}" created.`);
      } else {
        this.logger.error(`Bucket validation error: ${error.message}`);
        throw error;
      }
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<FileUploadResponse> {
    await this.ensureBucketExists();

    const key = `${Date.now()}-${fileName}`;
    const putCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });
    await this.s3Client.send(putCommand);

    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const downloadUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });

    return { key, downloadUrl };
  }
}
