import { OptionalUser, PublicRoute } from '@/auth/auth.guard';
import { GetFileDTO } from '@/files/file.dto';
import { FileService } from '@/files/file.service';
import { UserWithSettings } from '@/types/prisma';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Get('/:fileUuid')
    async retrieveFile(@Param() { fileUuid }: GetFileDTO, @OptionalUser() user?: UserWithSettings) {
        return await this.fileService.getFile({ fileUuid, user });
    }
}
