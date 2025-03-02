import { User } from '@server/auth/auth.guard';
import { DatabaseUserService } from '@server/database/user/user.service';
import { UserWithSettings } from '@server/types/prisma';
import { UpdateUserProfilePictureDTO } from '@server/user/user.dto';
import { UserService } from '@server/user/user.service';
import { HTTPError } from '@server/util/httpHandlers';
import { Controller, Get, HttpStatus, Param, Patch, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly databaseUserService: DatabaseUserService,
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
    async getUser(@User() user: UserWithSettings) {
        return this.databaseUserService.sanitizeUser(user);
    }
}
