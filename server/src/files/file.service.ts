import { Injectable, StreamableFile } from '@nestjs/common';
import { AppConfigService } from '@/config/app-config.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { DatabaseFileService } from '@/database/database-file/database-file.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { logger } from '@/main';

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
}
