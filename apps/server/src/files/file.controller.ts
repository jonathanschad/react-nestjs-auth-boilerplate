import { api } from '@darts/types';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';

import { OptionalUser, PublicRoute } from '@/auth/auth.guard';
import { FileService } from '@/files/file.service';
import type { UserWithSettings } from '@/types/prisma';

@Controller()
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @PublicRoute()
    @TsRestHandler(api.file.getFile)
    public retrieveFile(@OptionalUser() user: UserWithSettings | undefined) {
        return tsRestHandler(api.file.getFile, async ({ params }) => {
            const file = await this.fileService.getFile({ fileUuid: params.fileUuid, user });
            return { status: 200 as const, body: file as any };
        });
    }
}
