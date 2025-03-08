import { Global, Module } from '@nestjs/common';

import { AuthModule } from '@server/auth/auth.module';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { MailModule } from '@server/mail/mail.module';
import { SignupController } from '@server/signup/signup.controller';
import { SignupService } from '@server/signup/signup.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule],
    controllers: [SignupController],
    providers: [SignupService],
    exports: [SignupService],
})
export class SignupModule {}
