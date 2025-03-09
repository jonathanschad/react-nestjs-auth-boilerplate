import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from '@/auth/auth.controller';
import { AuthGuard } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GoogleAuthController } from '@/auth/google.auth.controller';
import { GoogleAuthService } from '@/auth/google.auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AppConfigModule } from '@/config/app-config.module';
import { DatabaseModule } from '@/database/database.module';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [AuthController, GoogleAuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        JWTService,
        AuthService,
        GoogleAuthService,
    ],
    exports: [JWTService, AuthService, GoogleAuthService],
})
export class AuthModule {}
