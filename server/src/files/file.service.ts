import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class FileService {
    constructor(
        private readonly appConfigService: AppConfigService,
        readonly prisma: PrismaService,
    ) {}
}
