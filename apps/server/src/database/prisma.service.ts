import { PrismaClient } from '@boilerplate/prisma';
import { Injectable, type OnModuleInit } from '@nestjs/common';

import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(appConfigService: AppConfigService) {
        super({ datasources: { db: { url: appConfigService.databaseUrl } } });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
