import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@server/config/app-config.module';
import { AuthService } from '@server/auth/auth.service';
import { JWTService } from '@server/auth/jwt.service';
import { AuthGuard } from '@server/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@server/database/database.module';
import { AuthController } from '@server/auth/auth.controller';
import { GoogleAuthController } from '@server/auth/google.auth.controller';
import { GoogleAuthService } from '@server/auth/google.auth.service';

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
