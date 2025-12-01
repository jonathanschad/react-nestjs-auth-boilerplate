import { UpdateUserProfilePictureDTO, UserUpdateablePropertiesDTO } from '@darts/types/api/user/user.dto';
import type { SanitizedUserWithSettings } from '@darts/types/entities/user';
import { Body, Controller, Get, HttpStatus, Param, Patch, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { User } from '@/auth/auth.guard';
import { DatabaseUserService } from '@/database/user/user.service';
import type { UserWithSettings } from '@/types/prisma';
import { UserService } from '@/user/user.service';
import { HTTPError } from '@/util/httpHandlers';

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

    @Patch('/')
    async updateUser(@User() user: UserWithSettings, @Body() updates: UserUpdateablePropertiesDTO) {
        return await this.userService.updateUser({ user, updates });
    }

    @Get()
    getUser(@User() user: UserWithSettings): SanitizedUserWithSettings {
        return this.databaseUserService.sanitizeUserWithSettings(user);
    }
}
