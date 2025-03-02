import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AppConfigService } from '@server/config/app-config.service';
import {
    FileDeleteOptions,
    FileDeleteResponse,
    FileGetOptions,
    FileGetResponse,
    FileUploadOptions,
    FileUploadResponse,
} from '@server/files/storage.service';
import { Readable } from 'stream';
import { StreamableFile } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';

export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: AppConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.s3Region,
            endpoint: this.configService.s3Endpoint,
            forcePathStyle: true,
            credentials: {
                accessKeyId: this.configService.s3AccessKeyId,
                secretAccessKey: this.configService.s3SecretAccessKey,
            },
        });
        this.bucketName = this.configService.s3BucketName;
    }

    async uploadMultiPartFile({
        path,
        file,
        contentType,
    }: FileUploadOptions<MultipartFile>): Promise<FileUploadResponse> {
        return this.uploadFile({ path, file: await file.toBuffer(), contentType });
    }

    async uploadFile({ path, file, contentType }: FileUploadOptions<Buffer>): Promise<FileUploadResponse> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: path,
            Body: file,
            ContentType: contentType,
        });
        await this.s3Client.send(command);

        return {
            size: file.buffer.byteLength,
            path,
            contentType,
        };
    }

    async getFile(dbFile: FileGetOptions): Promise<FileGetResponse> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: dbFile.path,
        });

        const response = await this.s3Client.send(command);

        if (!response.Body || !(response.Body instanceof Readable)) {
            throw new Error('Failed to get the file from S3');
        }

        return new StreamableFile(response.Body as Readable);
    }

    async deleteFile(dbFile: FileDeleteOptions): Promise<FileDeleteResponse> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: dbFile.path,
        });
        await this.s3Client.send(command);
        return dbFile;
    }
}
