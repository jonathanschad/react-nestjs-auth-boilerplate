import { Injectable, StreamableFile } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { DatabaseFileService } from '@/database/database-file/database-file.service';
import { createReadStream, createWriteStream, existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { logger } from '@/main';
import { pipeline } from 'stream/promises';
import { MultipartFile } from '@fastify/multipart';
import { User, UserState } from '@prisma/client';

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
            throw new HTTPError({ statusCode: HttpStatusCode.NOT_FOUND, message: 'File not found' });
        }
    }

    async saveFile({ file, user, fileUuid }: { file: MultipartFile; fileUuid: string; user: User }): Promise<string> {
        if (!this.isUserAllowedToWriteFile(user)) {
            throw new HTTPError({ statusCode: HttpStatusCode.FORBIDDEN, message: 'No permission' });
        }

        const fileDir = join(this.appConfigService.fileStoragePath, user.id);
        const filePath = join(fileDir, `${fileUuid}-${file.filename}`);
        if (!existsSync(fileDir)) {
            mkdirSync(fileDir, { recursive: true });
        }
        await pipeline(file.file, createWriteStream(filePath));
        const fileStats = statSync(filePath);
        const dbFile = await this.databaseFileService.createFile({
            file: {
                id: fileUuid,
                name: file.fieldname,
                mimeType: file.mimetype,
                size: fileStats.size,
                path: join(user.id, `${fileUuid}-${file.filename}`),
            },
            user,
        });
        return dbFile.id;
    }

    private isUserAllowedToWriteFile(user: User): boolean {
        return user.state === UserState.COMPLETE;
    }
}
