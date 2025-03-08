import { Global, Module } from '@nestjs/common';

import { AuthModule } from '@server/auth/auth.module';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { MailModule } from '@server/mail/mail.module';
import { PasswordController } from '@server/password/password.controller';
import { PasswordService } from '@server/password/password.service';
import { SignupModule } from '@server/signup/signup.module';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule, SignupModule],
    controllers: [PasswordController],
    providers: [PasswordService],
    exports: [PasswordService],
})
export class PasswordModule {}
