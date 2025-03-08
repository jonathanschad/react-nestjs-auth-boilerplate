import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppConfigService } from '@server/config/app-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
        }),
    ],
    controllers: [],
    providers: [AppConfigService, ConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
