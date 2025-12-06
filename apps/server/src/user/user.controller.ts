import { api } from '@darts/types';
import { Controller, HttpStatus, Req } from '@nestjs/common';
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

    @Implement(api.user.uploadProfilePicture)
    public uploadProfilePictureFile(@User() user: UserWithSettings, @Req() req: FastifyRequest) {
        return implement(api.user.uploadProfilePicture).handler(async ({ input }) => {
            const file = await req.file();
            if (!file) {
                throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'No file provided' });
            }
            if (user.profilePictureId === input.idempotencyKey) {
                throw new HTTPError({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Cannot upload the same profile picture twice',
                });
            }
            try {
                const fileBuffer = await file.toBuffer();

                await this.userService.updateUserProfilePicture({
                    fileBuffer,
                    fileUuid: input.idempotencyKey,
                    user,
                });

                return;
            } catch (err) {
                console.error('Error compressing image:', err);
                throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid image' });
            }
        });
    }

    @Implement(api.user.updateUser)
    public updateUser(@User() user: UserWithSettings) {
        return implement(api.user.updateUser).handler(async ({ input }) => {
            const updatedUser = await this.userService.updateUser({ user, updates: input });
            return this.databaseUserService.sanitizeUserWithSettings(updatedUser);
        });
    }
}
