import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

import { OptionalUser, PublicRoute, User } from '@/auth/auth.guard';
import { GetFileDTO } from '@/files/file.dto';
import { FileService } from '@/files/file.service';
import type { UserWithSettings } from '@/types/prisma';
import { Disabled } from '@/util/decorators/disabled';
import { HTTPError } from '@/util/httpHandlers';
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Get('/:fileUuid')
    async retrieveFile(@Param() { fileUuid }: GetFileDTO, @OptionalUser() user?: UserWithSettings) {
        return await this.fileService.getFile({ fileUuid, user });
    }

    @Disabled()
    @Patch('/:fileUuid')
    async updateFile(@Req() req: FastifyRequest, @Param() { fileUuid }: GetFileDTO, @User() user: UserWithSettings) {
        const file = await req.file();
        if (!file) {
            throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'No file provided' });
        }
        await this.fileService.saveFile({ file, fileUuid, user });
    }
}
