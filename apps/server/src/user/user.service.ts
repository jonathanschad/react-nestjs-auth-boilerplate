import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@server/config/app-config.service';
import { DatabaseFileService } from '@server/database/database-file/database-file.service';
import { File, FileAccess, User } from '@boilerplate/prisma';
import sharp from 'sharp';
import { FileService } from '@server/files/file.service';
import { DatabaseUserService } from '@server/database/user/user.service';
import { UserWithSettings } from '@server/types/prisma';

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

        const sharpImage = await sharp(fileBuffer)
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
