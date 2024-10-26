import { AppConfigService } from '@/config/app-config.service';
import {
    FileDeleteOptions,
    FileDeleteResponse,
    FileGetOptions,
    FileGetResponse,
    FileUploadOptions,
    FileUploadResponse,
} from '@/files/storage.service';
import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { StreamableFile } from '@nestjs/common';
import { pipeline } from 'stream';
import { MultipartFile } from '@fastify/multipart';

export class FileSystemService {
    constructor(private appConfigService: AppConfigService) {}

    async uploadFile({ path, file, contentType }: FileUploadOptions): Promise<FileUploadResponse> {
        const filePath = join(this.appConfigService.fileStoragePath, path);

        if (!existsSync(filePath)) {
            mkdirSync(filePath, { recursive: true });
        }

        if (file instanceof Buffer) {
            await writeFileSync(filePath, file);
        } else {
            const multipartFile = file as MultipartFile;
            await pipeline(multipartFile.file, createWriteStream(filePath));
        }

        const fileStats = statSync(filePath);

        return {
            size: fileStats.size,
            path,
            contentType,
        };
    }

    async getFile(dbFile: FileGetOptions): Promise<FileGetResponse> {
        const file = createReadStream(join(this.appConfigService.fileStoragePath, dbFile.path));
        return new StreamableFile(file, {
            type: dbFile.mimeType,
            disposition: `inline; filename="${dbFile.name}"`,
        });
    }

    async deleteFile(dbFile: FileDeleteOptions): Promise<FileDeleteResponse> {
        const filePath = join(this.appConfigService.fileStoragePath, dbFile.path);
        unlinkSync(filePath);

        return dbFile;
    }
}
