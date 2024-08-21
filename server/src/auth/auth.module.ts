import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AuthGuard } from '@/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@/database/database.module';
import { AuthController } from '@/auth/auth.controller';

@Global()
@Module({
    imports: [AppConfigModule, DatabaseModule],
    controllers: [AuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        JWTService,
        AuthService,
    ],
    exports: [JWTService, AuthService],
})
export class AuthModule {}
