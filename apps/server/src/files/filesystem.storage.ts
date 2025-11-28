import {
    createReadStream,
    createWriteStream,
    existsSync,
    mkdirSync,
    statSync,
    unlinkSync,
    writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { pipeline } from 'node:stream';
import type { MultipartFile } from '@fastify/multipart';
import { StreamableFile } from '@nestjs/common';

import { AppConfigService } from '@/config/app-config.service';
import type {
    FileDeleteOptions,
    FileDeleteResponse,
    FileGetOptions,
    FileGetResponse,
    FileUploadOptions,
    FileUploadResponse,
} from '@/files/storage.service';

export class FileSystemService {
    constructor(private appConfigService: AppConfigService) {}

    async uploadMultiPartFile({
        path,
        file,
        contentType,
    }: FileUploadOptions<MultipartFile>): Promise<FileUploadResponse> {
        return new Promise<FileUploadResponse>((resolve, reject) => {
            try {
                const filePath = join(this.appConfigService.fileStoragePath, path);

                if (!existsSync(filePath)) {
                    mkdirSync(filePath, { recursive: true });
                }

                const multipartFile = file;
                pipeline(multipartFile.file, createWriteStream(filePath));

                const fileStats = statSync(filePath);

                resolve({
                    size: fileStats.size,
                    path,
                    contentType,
                });
            } catch (error) {
                if (!(error instanceof Error)) {
                    throw error;
                }
                reject(error);
            }
        });
    }

    async uploadFile({ path, file, contentType }: FileUploadOptions<Buffer>): Promise<FileUploadResponse> {
        return new Promise<FileUploadResponse>((resolve, reject) => {
            try {
                const filePath = join(this.appConfigService.fileStoragePath, path);

                if (!existsSync(filePath)) {
                    mkdirSync(filePath, { recursive: true });
                }

                writeFileSync(filePath, file);

                const fileStats = statSync(filePath);

                resolve({
                    size: fileStats.size,
                    path,
                    contentType,
                });
            } catch (error) {
                if (!(error instanceof Error)) {
                    throw error;
                }
                reject(error);
            }
        });
    }

    async getFile(dbFile: FileGetOptions): Promise<FileGetResponse> {
        return new Promise<FileGetResponse>((resolve, reject) => {
            try {
                const file = createReadStream(join(this.appConfigService.fileStoragePath, dbFile.path));
                resolve(
                    new StreamableFile(file, {
                        type: dbFile.mimeType,
                        disposition: `inline; filename="${dbFile.name}"`,
                    }),
                );
            } catch (error) {
                if (!(error instanceof Error)) {
                    throw error;
                }
                reject(error);
            }
        });
    }

    async deleteFile(dbFile: FileDeleteOptions): Promise<FileDeleteResponse> {
        return new Promise<FileDeleteResponse>((resolve, reject) => {
            try {
                const filePath = join(this.appConfigService.fileStoragePath, dbFile.path);
                unlinkSync(filePath);

                resolve(dbFile);
            } catch (error) {
                if (!(error instanceof Error)) {
                    throw error;
                }
                reject(error);
            }
        });
    }
}
