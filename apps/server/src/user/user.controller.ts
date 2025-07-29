import { type FastifyRequest } from 'fastify';
import { Body, Controller, Get, HttpStatus, Param, Patch, Req } from '@nestjs/common';

import { User } from '@/auth/auth.guard';
import { DatabaseUserService } from '@/database/user/user.service';
import { PasswordService } from '@/password/password.service';
import { type UserWithSettings } from '@/types/prisma';
import { ChangePasswordDTO, UpdateUserNameDTO, UpdateUserProfilePictureDTO } from '@/user/user.dto';
import { UserService } from '@/user/user.service';
import { HTTPError } from '@/util/httpHandlers';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly passwordService: PasswordService,
    ) {}

    @Patch('/profile-picture/:idempotencyKey')
    async uploadProfilePictureFile(
        @Req() req: FastifyRequest,
        @Param() { idempotencyKey }: UpdateUserProfilePictureDTO,
        @User() user: UserWithSettings,
    ) {
        const file = await req.file();
        if (!file) {
            throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'No file provided' });
        }
        if (user.profilePictureId === idempotencyKey) {
            throw new HTTPError({
                statusCode: HttpStatus.CONFLICT,
                message: 'Cannot upload the same profile picture twice',
            });
        }
        try {
            const fileBuffer = await file.toBuffer();

            await this.userService.updateUserProfilePicture({
                fileBuffer,
                fileUuid: idempotencyKey,
                user,
            });
        } catch (err) {
            console.error('Error compressing image:', err);
            throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid image' });
        }
    }

    @Get()
    getUser(@User() user: UserWithSettings) {
        return this.databaseUserService.sanitizeUser(user);
    }

    @Patch('/name')
    async updateUserName(@Body() { name }: UpdateUserNameDTO, @User() user: UserWithSettings) {
        const updatedUser = await this.databaseUserService.updateName({
            userId: user.id,
            name,
        });
        return this.databaseUserService.sanitizeUser(updatedUser);
    }

    @Patch('/password')
    async changePassword(@Body() { currentPassword, newPassword }: ChangePasswordDTO, @User() user: UserWithSettings) {
        await this.passwordService.changePasswordWithPassword(user.email, currentPassword, newPassword);
        return { success: true };
    }
}
