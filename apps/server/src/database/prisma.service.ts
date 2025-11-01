import { PrismaClient } from '@boilerplate/prisma';
import { Injectable, type OnModuleInit } from '@nestjs/common';

import type { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private appConfigService: AppConfigService) {
        super({ datasources: { db: { url: appConfigService.databaseUrl } } });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
