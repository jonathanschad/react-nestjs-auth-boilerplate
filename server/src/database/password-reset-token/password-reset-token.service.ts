import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AppConfigService } from '@/config/app-config.service';
import { PasswordResetToken } from '@prisma/client';
import { UserWithSettings } from '@/types/prisma';

interface PasswordResetTokenWithUser extends PasswordResetToken {
    user: UserWithSettings;
}

@Injectable()
export class PasswordResetTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    public async findValidTokenBySecret(hashedSecret: string): Promise<PasswordResetTokenWithUser | null> {
        const passwordResetToken = await this.prisma.passwordResetToken.findFirst({
            where: {
                hashedSecret,
                expiresAt: { gte: new Date() },
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
        await this.prisma.passwordResetToken.updateMany({
            where: {
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
    }): Promise<PasswordResetToken> {
        await this.invalidatePasswordResetTokensFromUser(userId);

        return await this.prisma.passwordResetToken.create({
            data: {
                userId,
                hashedSecret,
                expiresAt,
            },
        });
    }
}
