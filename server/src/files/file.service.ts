import { Injectable, StreamableFile } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { DatabaseFileService } from '@/database/database-file/database-file.service';
import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { logger } from '@/main';
import { pipeline } from 'stream/promises';
import { MultipartFile } from '@fastify/multipart';
import { File, FileAccess, User, UserState } from '@prisma/client';
import sharp from 'sharp';

@Injectable()
export class FileService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly databaseFileService: DatabaseFileService,
    ) {}

    async getFile({ fileUuid, user }: { fileUuid: string; user?: { id: string } }): Promise<StreamableFile> {
        const dbFile = await this.databaseFileService.find({ user, fileUuid });
        if (!dbFile) {
            throw new HTTPError({ statusCode: HttpStatusCode.NOT_FOUND, message: 'File not found' });
        }

        try {
            const file = createReadStream(join(this.appConfigService.fileStoragePath, dbFile.path));
            return new StreamableFile(file, {
                type: dbFile.mimeType,
                disposition: `inline; filename="${dbFile.name}"`,
            });
        } catch (error) {
            logger.error('Error while reading file', error);
            throw new HTTPError({ statusCode: HttpStatusCode.NOT_FOUND, message: ' si' });
        }
    }

    async saveFile({
        file,
        user,
        fileUuid,
        fileAccess,
    }: {
        file: MultipartFile | { filename: string; file: sharp.Sharp; mimetype: string };
        fileUuid: string;
        user: User;
        fileAccess?: FileAccess;
    }): Promise<File> {
        if (!this.isUserAllowedToWriteFile(user)) {
            throw new HTTPError({ statusCode: HttpStatusCode.FORBIDDEN, message: 'No permission' });
        }

        const fileDir = join(this.appConfigService.fileStoragePath, user.id);
        const filePath = join(fileDir, `${fileUuid}-${file.filename}`);
        if (!existsSync(fileDir)) {
            mkdirSync(fileDir, { recursive: true });
        }

        if (file.file instanceof sharp) {
            const sharpFile = file.file as sharp.Sharp;
            await sharpFile.toFile(filePath);
        } else {
            const multipartFile = file as MultipartFile;
            await pipeline(multipartFile.file, createWriteStream(filePath));
        }

        const fileStats = statSync(filePath);
        const dbFile = await this.databaseFileService.createFile({
            file: {
                id: fileUuid,
                name: file.filename,
                mimeType: file.mimetype,
                size: fileStats.size,
                path: join(user.id, `${fileUuid}-${file.filename}`),
                access: fileAccess,
            },
            user,
        });
        return dbFile;
    }

    public async deleteFile({ file, user }: { file: { id: string } | File; user: User }): Promise<File> {
        const deletedFile = await this.databaseFileService.deleteFile({ file, user });
        if (!this.isUserAllowedToWriteFile(user)) {
            throw new HTTPError({ statusCode: HttpStatusCode.FORBIDDEN, message: 'No permission' });
        }

        const filePath = join(this.appConfigService.fileStoragePath, deletedFile.path);
        unlinkSync(filePath);

        return deletedFile;
    }

    private isUserAllowedToWriteFile(user: User): boolean {
        return user.state === UserState.COMPLETE;
    }
}
