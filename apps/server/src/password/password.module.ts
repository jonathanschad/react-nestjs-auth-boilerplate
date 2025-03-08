import { Global, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from '@/mail/mail.module';
import { PasswordController } from '@/password/password.controller';
import { PasswordService } from '@/password/password.service';
import { SignupModule } from '@/signup/signup.module';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule, SignupModule],
    controllers: [PasswordController],
    providers: [PasswordService],
    exports: [PasswordService],
})
export class PasswordModule {}
