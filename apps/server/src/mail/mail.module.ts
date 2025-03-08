import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { MailService } from '@/mail/mail.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
