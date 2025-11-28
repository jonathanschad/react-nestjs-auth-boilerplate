import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SentryModule } from '@sentry/nestjs/setup';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/config/app-config.module';
import { GameModule } from '@/dart/game/game.module';
import { ImportModule } from '@/dart/import/import.module';
import { PlayerModule } from '@/dart/player/player.module';
import { DatabaseModule } from '@/database/database.module';
import { FileModule } from '@/files/file.module';
import { MailModule } from '@/mail/mail.module';
import { PasswordModule } from '@/password/password.module';
import { SignupModule } from '@/signup/signup.module';
import { UserModule } from '@/user/user.module';

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
        GameModule,
        PlayerModule,
        ImportModule,
        SentryModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
