import { api } from '@darts/types';
import { Controller, HttpStatus, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
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

    @TsRestHandler(api.user.uploadProfilePicture)
    public uploadProfilePictureFile(@User() user: UserWithSettings, @Req() req: FastifyRequest) {
        return tsRestHandler(api.user.uploadProfilePicture, async ({ params }) => {
            const file = await req.file();
            if (!file) {
                throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'No file provided' });
            }
            if (user.profilePictureId === params.idempotencyKey) {
                throw new HTTPError({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Cannot upload the same profile picture twice',
                });
            }
            try {
                const fileBuffer = await file.toBuffer();

                await this.userService.updateUserProfilePicture({
                    fileBuffer,
                    fileUuid: params.idempotencyKey,
                    user,
                });

                return { status: 200 as const, body: undefined };
            } catch (err) {
                console.error('Error compressing image:', err);
                throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid image' });
            }
        });
    }

    @TsRestHandler(api.user.updateUser)
    public updateUser(@User() user: UserWithSettings) {
        return tsRestHandler(api.user.updateUser, async ({ body }) => {
            const updatedUser = await this.userService.updateUser({ user, updates: body });
            return { status: 200 as const, body: this.databaseUserService.sanitizeUserWithSettings(updatedUser) };
        });
    }
}
