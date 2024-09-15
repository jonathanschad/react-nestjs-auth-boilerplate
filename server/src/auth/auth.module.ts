import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AuthGuard } from '@/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@/database/database.module';
import { AuthController } from '@/auth/auth.controller';
import { GoogleAuthController } from '@/auth/google.auth.controller';
import { GoogleAuthService } from '@/auth/google.auth.service';

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
