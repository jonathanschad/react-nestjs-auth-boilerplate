import { Module } from '@nestjs/common';
import { AppService } from '@server/app.service';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseModule } from '@server/database/database.module';
import { AuthModule } from '@server/auth/auth.module';
import { SignupModule } from '@server/signup/signup.module';
import { MailModule } from '@server/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PasswordModule } from '@server/password/password.module';
import { FileModule } from '@server/files/file.module';
import { UserModule } from '@server/user/user.module';
import { AppController } from '@server/app.controller';
import { SentryModule } from '@sentry/nestjs/setup';
import { TrpcModule } from '@server/trpc/trpc.module';

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
