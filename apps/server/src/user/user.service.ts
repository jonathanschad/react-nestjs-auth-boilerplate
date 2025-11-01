import { type File, FileAccess, type User } from '@boilerplate/prisma';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import type { AppConfigService } from '@/config/app-config.service';
import type { DatabaseFileService } from '@/database/database-file/database-file.service';
import type { DatabaseUserService } from '@/database/user/user.service';
import type { FileService } from '@/files/file.service';
import type { UserWithSettings } from '@/types/prisma';

@Injectable()
export class UserService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly databaseFileService: DatabaseFileService,
        private readonly fileService: FileService,
        private readonly databaseUserService: DatabaseUserService,
    ) {}

    public async updateUserProfilePicture({
        fileBuffer,
        user,
        fileUuid,
    }: {
        fileBuffer: Buffer;
        fileUuid: string;
        user: User;
    }): Promise<UserWithSettings> {
        const DIMENSIONS = { width: 128, height: 128 } as const;

        const sharpImage = sharp(fileBuffer)
            .resize({
                width: DIMENSIONS.width,
                height: DIMENSIONS.height,
                fit: sharp.fit.contain, // Ensure the image fits within the dimensions while maintaining aspect ratio
                background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
            })
            .toFormat('webp', { quality: 80 });

        let oldPicture: File | undefined;
        if (user.profilePictureId) {
            oldPicture = await this.fileService.deleteFile({ file: { id: user.profilePictureId }, user });
        }

        const savedFile = await this.fileService.saveFile({
            file: { file: sharpImage, filename: 'profile-picture.webp', mimetype: 'image/webp' },
            fileUuid: fileUuid,
            user,
            fileAccess: oldPicture?.access ?? FileAccess.PUBLIC,
        });

        return await this.databaseUserService.updateProfilePicture({ userId: user.id, profilePictureId: savedFile.id });
    }
}
