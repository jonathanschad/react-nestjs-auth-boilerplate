import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '@server/config/app-config.module';
import { DatabaseUserService } from '@server/database/user/user.service';
import { AccessTokenService } from '@server/database/access-token/access-token.service';
import { RefreshTokenService } from '@server/database/refresh-token/refresh-token.service';
import { EmailVerificationTokenService } from '@server/database/email-verification-token/email-verification-token.service';
import { PasswordResetTokenService } from '@server/database/password-reset-token/password-reset-token.service';
import { PrismaService } from '@server/database/prisma.service';
import { ConnectGoogleAccountTokenService } from '@server/database/connect-google-account-token/connect-google-account-token.service';
import { DatabaseFileService } from '@server/database/database-file/database-file.service';

@Global()
@Module({
    imports: [AppConfigModule],
    controllers: [],
    providers: [
        PrismaService,
        DatabaseUserService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
        ConnectGoogleAccountTokenService,
        DatabaseFileService,
    ],
    exports: [
        PrismaService,
        DatabaseUserService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
        ConnectGoogleAccountTokenService,
        DatabaseFileService,
    ],
})
export class DatabaseModule {}
