import { type File, type FileAccess, type User, UserState } from '@boilerplate/prisma';
import type { MultipartFile } from '@fastify/multipart';
import { Injectable, Logger, type StreamableFile } from '@nestjs/common';
import { join } from 'path';
import sharp from 'sharp';

import type { DatabaseFileService } from '@/database/database-file/database-file.service';
import type { FileUploadResponse, StorageService } from '@/files/storage.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';

@Injectable()
export class FileService {
    private readonly logger = new Logger(FileService.name);

    constructor(
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
            this.logger.error('Error while reading file', error);
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
