import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@/config/app-config.module';
import { SlackService } from '@/slack/slack.service';

@Global()
@Module({
    imports: [AppConfigModule],
    controllers: [],
    providers: [SlackService],
    exports: [SlackService],
})
export class SlackModule {}
