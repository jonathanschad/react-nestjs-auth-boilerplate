import { api } from '@boilerplate/types';
import { Controller, HttpStatus, Param, Patch, Req } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import type { FastifyRequest } from 'fastify';
import { User } from '@/auth/auth.guard';
import { DatabaseUserService } from '@/database/user/user.service';
import type { UserWithSettings } from '@/types/prisma';
import { UserService } from '@/user/user.service';
import { HTTPError } from '@/util/httpHandlers';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly databaseUserService: DatabaseUserService,
    ) {}

    @Implement(api.user.getUser)
    public getUser(@User() user: UserWithSettings) {
        return implement(api.user.getUser).handler(async () => {
            return this.databaseUserService.sanitizeUserWithSettings(user);
        });
    }

    @Patch(api.user.uploadProfilePicture['~orpc'].route.path!.replace('{idempotencyKey}', ':idempotencyKey'))
    public async uploadProfilePictureFile(
        @User() user: UserWithSettings,
        @Req() req: FastifyRequest,
        @Param('idempotencyKey') idempotencyKey: string,
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

            return;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid image' });
        }
    }

    @Implement(api.user.updateUser)
    public updateUser(@User() user: UserWithSettings) {
        return implement(api.user.updateUser).handler(async ({ input }) => {
            const updatedUser = await this.userService.updateUser({ user, updates: input });
            return this.databaseUserService.sanitizeUserWithSettings(updatedUser);
        });
    }
}
