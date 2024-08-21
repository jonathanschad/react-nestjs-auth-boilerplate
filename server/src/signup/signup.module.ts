import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { SignupService } from '@/signup/signup.service';
import { SignupController } from '@/signup/signup.controller';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from '@/mail/mail.module';
import { AuthModule } from '@/auth/auth.module';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule, MailModule, AuthModule],
    controllers: [SignupController],
    providers: [SignupService],
    exports: [SignupService],
})
export class SignupModule {}
