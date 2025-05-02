import { Injectable } from '@nestjs/common';

import { Token, TokenType } from '@boilerplate/prisma';

import { AppConfigService } from '@/config/app-config.service';
import { PrismaService } from '@/database/prisma.service';
import type { UserWithSettings } from '@/types/prisma';

interface PasswordResetTokenWithUser extends Token {
    user: UserWithSettings;
}

@Injectable()
export class PasswordResetTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    public async findValidTokenBySecret(hashedSecret: string): Promise<PasswordResetTokenWithUser | null> {
        const passwordResetToken = await this.prisma.token.findFirst({
            where: {
                hashedSecret,
                expiresAt: { gte: new Date() },
                type: TokenType.PASSWORD_RESET,
                valid: true,
            },
            include: {
                user: {
                    include: {
                        settings: true,
                    },
                },
            },
        });
        return passwordResetToken;
    }

    public async invalidatePasswordResetTokensFromUser(userId: string) {
        await this.prisma.token.updateMany({
            where: {
                type: TokenType.PASSWORD_RESET,
                userId: userId,
            },
            data: {
                valid: false,
                expiresAt: new Date(),
            },
        });
    }

    public async createPasswordResetToken({
        userId,
        hashedSecret,
        expiresAt,
    }: {
        userId: string;
        hashedSecret: string;
        expiresAt: Date;
    }): Promise<Token> {
        await this.invalidatePasswordResetTokensFromUser(userId);

        return await this.prisma.token.create({
            data: {
                userId,
                hashedSecret,
                expiresAt,
                type: TokenType.PASSWORD_RESET,
            },
        });
    }
}
