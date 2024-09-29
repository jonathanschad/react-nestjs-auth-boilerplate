import { SkipAuth } from '@/auth/auth.guard';
import { AppConfigService } from '@/config/app-config.service';
import { GetFileDTO } from '@/files/file.dto';
import { Controller, Get, HttpCode, HttpStatus, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
    constructor(private readonly appConfigService: AppConfigService) {}

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Get('/:fileUuid')
    async retrieveFile(@Param() { fileUuid }: GetFileDTO) {
        // Retrieve file from storage

        const file = createReadStream(join(this.appConfigService.fileStoragePath, 'pexels-photo-417074.jpeg'));
        return new StreamableFile(file, {
            type: 'image/jpeg',
            disposition: 'inline; filename="image.jpeg"',
        });
    }
}
