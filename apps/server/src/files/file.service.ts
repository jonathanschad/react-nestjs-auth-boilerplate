import { Injectable, StreamableFile } from '@nestjs/common';
import { AppConfigService } from '@server/config/app-config.service';
import HttpStatusCode, { HTTPError } from '@server/util/httpHandlers';
import { DatabaseFileService } from '@server/database/database-file/database-file.service';
import { join } from 'path';
import { logger } from '@server/main';
import { MultipartFile } from '@fastify/multipart';
import { File, FileAccess, User, UserState } from '@boilerplate/prisma';
import sharp from 'sharp';
import { FileUploadResponse, StorageService } from '@server/files/storage.service';

@Injectable()
export class FileService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly databaseFileService: DatabaseFileService,
        private readonly storageService: StorageService,
    ) {}

    async getFile({ fileUuid, user }: { fileUuid: string; user?: { id: string } }): Promise<StreamableFile> {
        const dbFile = await this.databaseFileService.find({ user, fileUuid });
        if (!dbFile) {
            throw new HTTPError({ statusCode: HttpStatusCode.NOT_FOUND, message: 'File not found' });
        }

        try {
            return this.storageService.getFile(dbFile);
        } catch (error) {
            logger.error('Error while reading file', error);
            throw new HTTPError({ statusCode: HttpStatusCode.NOT_FOUND, message: 'Could not read file' });
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

        const filePath = join(user.id, `${fileUuid}-${file.filename}`);

        let fileCreateInput: FileUploadResponse;
        if (file.file instanceof sharp) {
            fileCreateInput = await this.storageService.saveFile({
                file: await (file.file as sharp.Sharp).toBuffer(),
                path: filePath,
                contentType: file.mimetype,
            });
        } else {
            fileCreateInput = await this.storageService.saveMultiPartFile({
                file: file as MultipartFile,
                path: filePath,
                contentType: file.mimetype,
            });
        }

        const dbFile = await this.databaseFileService.createFile({
            file: {
                id: fileUuid,
                name: file.filename,
                mimeType: fileCreateInput.contentType,
                size: fileCreateInput.size,
                path: fileCreateInput.path,
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

        await this.storageService.deleteFile(deletedFile);

        return deletedFile;
    }

    private isUserAllowedToWriteFile(user: User): boolean {
        return ([UserState.COMPLETE, UserState.VERIFIED] as UserState[]).includes(user.state);
    }
}
