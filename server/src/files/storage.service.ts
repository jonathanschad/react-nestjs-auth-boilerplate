import { Injectable, StreamableFile } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import { File } from '@prisma/client';
import { S3Service } from '@/files/s3.storage';
import { FileSystemService } from '@/files/filesystem.storage';
import { MultipartFile } from '@fastify/multipart';

export type FileUploadOptions = {
    path: string;
    file: Buffer | MultipartFile;
    contentType: string;
};
export type FileUploadResponse = { size: number; path: string; contentType: string };

export type FileGetOptions = File;
export type FileGetResponse = StreamableFile;

export type FileDeleteOptions = File;
export type FileDeleteResponse = File;

@Injectable()
export class StorageService {
    storageProvider: S3Service | FileSystemService;

    constructor(private readonly appConfigService: AppConfigService) {
        if (this.appConfigService.storageType === 's3') {
            this.storageProvider = new S3Service(this.appConfigService);
        } else {
            this.storageProvider = new FileSystemService(this.appConfigService);
        }
    }

    async getFile(options: FileGetOptions): Promise<FileGetResponse> {
        return this.storageProvider.getFile(options);
    }

    async saveFile(options: FileUploadOptions): Promise<FileUploadResponse> {
        return this.storageProvider.uploadFile(options);
    }

    public async deleteFile(options: FileDeleteOptions): Promise<FileDeleteResponse> {
        return this.storageProvider.deleteFile(options);
    }
}
