import { MultipartFile } from '@fastify/multipart';
import { Injectable, StreamableFile } from '@nestjs/common';

import { AppConfigService } from '@server/config/app-config.service';
import { FileSystemService } from '@server/files/filesystem.storage';
import { S3Service } from '@server/files/s3.storage';
import { File } from '@boilerplate/prisma';

export type FileUploadOptions<T extends Buffer | MultipartFile = Buffer | MultipartFile> = {
    path: string;
    file: T;
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

    async saveMultiPartFile(options: FileUploadOptions<MultipartFile>): Promise<FileUploadResponse> {
        return this.storageProvider.uploadMultiPartFile(options);
    }

    async saveFile(options: FileUploadOptions<Buffer>): Promise<FileUploadResponse> {
        return this.storageProvider.uploadFile(options);
    }

    public async deleteFile(options: FileDeleteOptions): Promise<FileDeleteResponse> {
        return this.storageProvider.deleteFile(options);
    }
}
