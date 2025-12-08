import { Global, Module } from '@nestjs/common';

import { AppConfigModule } from '@/config/app-config.module';
import { AccessTokenService } from '@/database/access-token/access-token.service';
import { ConnectGoogleAccountTokenService } from '@/database/connect-google-account-token/connect-google-account-token.service';
import { DatabaseFileService } from '@/database/database-file/database-file.service';
import { EmailVerificationTokenService } from '@/database/email-verification-token/email-verification-token.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseGameStatisticService } from '@/database/game/game-statistic.service';
import { DatabaseGameVisitService } from '@/database/game/game-visit.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';
import { PasswordResetTokenService } from '@/database/password-reset-token/password-reset-token.service';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from '@/database/refresh-token/refresh-token.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Global()
@Module({
    imports: [AppConfigModule],
    controllers: [],
    providers: [
        PrismaService,
        DatabaseUserService,
        DatabaseGameService,
        DatabaseEloHistoryService,
        DatabaseGameStatisticService,
        DatabaseGameVisitService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
        ConnectGoogleAccountTokenService,
        DatabaseFileService,
        DatabaseEloHistoryService,
        DatabaseOpenSkillHistoryService,
    ],
    exports: [
        PrismaService,
        DatabaseUserService,
        DatabaseGameService,
        DatabaseEloHistoryService,
        DatabaseGameStatisticService,
        DatabaseGameVisitService,
        AccessTokenService,
        RefreshTokenService,
        EmailVerificationTokenService,
        PasswordResetTokenService,
        ConnectGoogleAccountTokenService,
        DatabaseFileService,
        DatabaseEloHistoryService,
        DatabaseOpenSkillHistoryService,
    ],
})
export class DatabaseModule {}
