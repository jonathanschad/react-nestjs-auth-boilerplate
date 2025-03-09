import { Injectable } from '@nestjs/common';

import { TokenType } from '@boilerplate/prisma';

import { AppConfigService } from '@/config/app-config.service';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class EmailVerificationTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
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
