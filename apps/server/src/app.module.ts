import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SentryModule } from '@sentry/nestjs/setup';

import { AppController } from '@server/app.controller';
import { AppService } from '@server/app.service';
import { AuthModule } from '@server/auth/auth.module';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { FileModule } from '@server/files/file.module';
import { MailModule } from '@server/mail/mail.module';
import { PasswordModule } from '@server/password/password.module';
import { SignupModule } from '@server/signup/signup.module';
import { TrpcModule } from '@server/trpc/trpc.module';
import { UserModule } from '@server/user/user.module';

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
        TrpcModule,
        SentryModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
