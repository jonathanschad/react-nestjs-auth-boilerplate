import { PrismaClient } from '@boilerplate/prisma';
import { Injectable, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(appConfigService: AppConfigService) {
        super({
            adapter: new PrismaPg({ connectionString: appConfigService.databaseUrl }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
