import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { UserService } from '@/database/user/user.service';
import { AccessTokenService } from '@/database/access-token/access-token.service';
import { RefreshTokenService } from '@/database/refresh-token/refresh-token.service';
import { EmailVerificationTokenService } from '@/database/email-verification-token/email-verification-token.service';
import { UserController } from '@/database/user/user.controller';
import { PasswordResetTokenService } from '@/database/password-reset-token/password-reset-token.service';
import { PrismaService } from '@/database/prisma.service';

@Global()
@Module({
    imports: [AppConfigModule],
    controllers: [UserController],
    providers: [
        PrismaService,
        UserService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
    ],
    exports: [
        PrismaService,
        UserService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
    ],
})
export class DatabaseModule {}
