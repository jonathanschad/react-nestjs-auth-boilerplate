import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@server/config/app-config.module';
import { SignupService } from '@server/signup/signup.service';
import { SignupController } from '@server/signup/signup.controller';
import { DatabaseModule } from '@server/database/database.module';
import { MailModule } from '@server/mail/mail.module';
import { AuthModule } from '@server/auth/auth.module';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule],
    controllers: [SignupController],
    providers: [SignupService],
    exports: [SignupService],
})
export class SignupModule {}
