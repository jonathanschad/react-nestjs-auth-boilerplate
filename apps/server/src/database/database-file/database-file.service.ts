import { Injectable, Logger } from '@nestjs/common';

import { File, FileAccess, FilePermission, FilePermissionType, Prisma, User } from '@boilerplate/prisma';

import { PrismaService } from '@/database/prisma.service';

export const READ_PERMISSIONS: readonly FilePermissionType[] = [
    FilePermissionType.READ,
    FilePermissionType.WRITE,
    FilePermissionType.CREATOR,
    FilePermissionType.DELETE,
] as const;
export const WRITE_PERMISSIONS: readonly FilePermissionType[] = [
    FilePermissionType.WRITE,
    FilePermissionType.CREATOR,
    FilePermissionType.DELETE,
] as const;
export const DELETE_PERMISSIONS: readonly FilePermissionType[] = [
    FilePermissionType.CREATOR,
    FilePermissionType.DELETE,
] as const;
export const CREATOR_PERMISSIONS: readonly FilePermissionType[] = [FilePermissionType.CREATOR] as const;

export class PermissionError extends Error {
    public user: User;
    public file: { id: string } | File;
    public filePermission?: FilePermission;

    constructor({
        user,
        file,
        filePermission,
    }: {
        user: User;
        file: { id: string } | File;
        filePermission?: FilePermission;
    }) {
        super('Permission denied');

        this.user = user;
        this.file = file;
        this.filePermission = filePermission;
    }
}

@Injectable()
export class DatabaseFileService {
    private readonly logger = new Logger(DatabaseFileService.name);

    constructor(private prisma: PrismaService) {}

    async find({ user, fileUuid }: { user: { id: string } | undefined; fileUuid: string }): Promise<File | null> {
        const dbFile = await this.prisma.file.findFirst({
            where: {
                id: fileUuid,
            },
            include: {
                usersWithAccess: true,
            },
        });
        if (!dbFile) return null;
        if (dbFile.access === FileAccess.PUBLIC) return dbFile;
        if (user) {
            if (dbFile.usersWithAccess.find((u) => u.userId === user.id && READ_PERMISSIONS.includes(u.permission))) {
                return dbFile;
            }
        } else {
            this.logger.warn('Tried to access a private file without a user');
        }
        return null;
    }

    async createFile({ file, user }: { file: Prisma.FileCreateInput; user: { id: string } }): Promise<File> {
        return this.prisma.file.create({
            data: {
                ...file,
                usersWithAccess: { create: [{ userId: user.id, permission: FilePermissionType.CREATOR }] },
            },
        });
    }

    public async deleteFile({ file, user }: { file: { id: string }; user: User }): Promise<File> {
        const dbFilePermission = await this.prisma.filePermission.findFirst({
            where: {
                fileId: file.id,
                userId: user.id,
            },
        });

        if (!dbFilePermission) {
            throw new PermissionError({ user, file });
        }
        if (!DELETE_PERMISSIONS.includes(dbFilePermission.permission)) {
            throw new PermissionError({ user, file, filePermission: dbFilePermission });
        }

        return await this.prisma.file.delete({
            where: {
                id: file.id,
            },
        });
    }
}
