import { Module } from '@nestjs/common';
import { AppService } from '@/app.service';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { SignupModule } from '@/signup/signup.module';
import { MailModule } from '@/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '@/password/password.module';
import { FileModule } from '@/files/file.module';
import { UserModule } from '@/user/user.module';
import { AppController } from '@/app.controller';
import { SentryModule } from '@sentry/nestjs/setup';
@Module({
    imports: [
        DatabaseModule,
        AppConfigModule,
        AuthModule,
        SignupModule,
        MailModule,
        JwtModule,
        PasswordModule,
        FileModule,
        UserModule,
        SentryModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
