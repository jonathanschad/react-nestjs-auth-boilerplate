import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { MailService } from '@server/mail/mail.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
