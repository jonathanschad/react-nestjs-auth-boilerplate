import { Global, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from '@/mail/mail.module';
import { SignupController } from '@/signup/signup.controller';
import { SignupService } from '@/signup/signup.service';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule],
    controllers: [SignupController],
    providers: [SignupService],
    exports: [SignupService],
})
export class SignupModule {}
