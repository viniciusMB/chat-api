export interface UploadFileResponse {
  downloadUrl: string;
  key: string;
}

export interface IBucketRepository {
    uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        contentType: string,
      ): Promise<UploadFileResponse>
}