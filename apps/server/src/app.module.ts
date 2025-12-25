import { Module } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ORPCModule, onError } from '@orpc/nest';
import { SentryModule } from '@sentry/nestjs/setup';
import type { FastifyRequest } from 'fastify';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';
import { FileModule } from '@/files/file.module';
import { MailModule } from '@/mail/mail.module';
import { PasswordModule } from '@/password/password.module';
import { SignupModule } from '@/signup/signup.module';
import { UserModule } from '@/user/user.module';
import { logDetailedError } from '@/util/error-logger';

declare module '@orpc/nest' {
    /**
     * Extend oRPC global context to make it type-safe inside your handlers/middlewares
     */
    interface ORPCGlobalContext {
        request: FastifyRequest;
    }
}

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
        ORPCModule.forRootAsync({
            useFactory: (request: FastifyRequest) => ({
                interceptors: [
                    onError((error) => {
                        logDetailedError({
                            error,
                            request,
                        });
                    }),
                ],
                context: { request },
                eventIteratorKeepAliveInterval: 5000,
            }),
            inject: [REQUEST],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
