import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AppConfigService } from '@/config/app-config.service';
import { Token, TokenType } from '@prisma/client';

@Injectable()
export class ConnectGoogleAccountTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    public async findConnectGoogleAccountToken(hashedSecret: string) {
        const emailVerificationToken = await this.prisma.token.findFirst({
            where: {
                hashedSecret,
                expiresAt: { gte: new Date() },
                valid: true,
                type: TokenType.CONNECT_GOOGLE_ACCOUNT,
            },
        });
        return emailVerificationToken;
    }

    public async invalidateConnectGoogleAccountTokensByUser(userId: string) {
        await this.prisma.token.updateMany({
            where: {
                userId,
                type: TokenType.CONNECT_GOOGLE_ACCOUNT,
            },
            data: {
                valid: false,
            },
        });
    }

    public async createConnectGoogleAccountToken({
        userId,
        hashedSecret,
        expiresAt,
    }: {
        userId: string;
        hashedSecret: string;
        expiresAt: Date;
    }): Promise<Token> {
        await this.invalidateConnectGoogleAccountTokensByUser(userId);

        return await this.prisma.token.create({
            data: {
                userId,
                hashedSecret,
                expiresAt,
                type: TokenType.CONNECT_GOOGLE_ACCOUNT,
            },
        });
    }
}
