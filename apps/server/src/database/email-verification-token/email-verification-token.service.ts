import { TokenType } from '@boilerplate/prisma';
import { Injectable } from '@nestjs/common';

import type { AppConfigService } from '@/config/app-config.service';
import type { PrismaService } from '@/database/prisma.service';

@Injectable()
export class EmailVerificationTokenService {
    constructor(
        private prisma: PrismaService,
        _configService: AppConfigService,
    ) {}

    public async findEmailVerificationToken(hashedSecret: string) {
        const emailVerificationToken = await this.prisma.token.findFirst({
            where: {
                hashedSecret,
                expiresAt: { gte: new Date() },
                valid: true,
                type: TokenType.EMAIL_VERIFICATION,
            },
        });
        return emailVerificationToken;
    }

    public async invalidateEmailVerificationToken(hashedSecret: string) {
        await this.prisma.token.update({
            where: {
                type: TokenType.EMAIL_VERIFICATION,
                hashedSecret,
            },
            data: {
                valid: false,
            },
        });
    }
}
