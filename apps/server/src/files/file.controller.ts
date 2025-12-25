import { api } from '@boilerplate/types';
import { Controller, Get, Param } from '@nestjs/common';

import { OptionalUser, PublicRoute } from '@/auth/auth.guard';
import { FileService } from '@/files/file.service';
import type { UserWithSettings } from '@/types/prisma';

@Controller()
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @PublicRoute()
    // Note this is a bit hacky, as i could not get this to work properly with the orpc library.
    // the usual path should be /file/{fileUuid}
    @Get(api.file.getFile['~orpc'].route.path!.replace('{fileUuid}', ':fileUuid'))
    public async retrieveFile(@OptionalUser() user: UserWithSettings | undefined, @Param('fileUuid') fileUuid: string) {
        const file = await this.fileService.getFile({ fileUuid, user });

        return file;
    }
}
