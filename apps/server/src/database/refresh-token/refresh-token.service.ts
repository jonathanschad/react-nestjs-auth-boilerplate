import { Injectable } from '@nestjs/common';
import { PrismaService } from '@server/database/prisma.service';
import { AppConfigService } from '@server/config/app-config.service';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
@Injectable()
export class RefreshTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    public async findRefreshToken(refreshToken: string) {
        const refreshTokenDb = await this.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                valid: true,
                expiresAt: { gte: new Date() },
            },
            include: {
                user: true,
            },
        });

        return refreshTokenDb;
    }

    public async createRefreshToken(userId: string, oldRefreshToken?: string, rememberUser?: boolean) {
        const token = jwt.sign(
            {
                salt: uuid.v4(),
            },
            this.configService.jwtTokenSecret,
            {
                expiresIn: this.configService.refreshTokenExpiry,
            },
        );
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.configService.refreshTokenExpiry);
        if (oldRefreshToken) {
            const oldToken = await this.prisma.refreshToken.update({
                where: { token: oldRefreshToken },
                data: { valid: false, expiresAt: new Date(), lastUsedAt: new Date() },
            });
            rememberUser = oldToken.rememberUser;
        }
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
                valid: true,
                rememberUser,
            },
        });

        return token;
    }

    public async invalidateRefreshToken(refreshToken: string) {
        await this.prisma.refreshToken.update({
            where: {
                token: refreshToken,
            },
            data: {
                valid: false,
                expiresAt: new Date(),
            },
        });
    }

    public async invalidateRefreshTokensFromUser(userId: string) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId: userId,
            },
            data: {
                valid: false,
                expiresAt: new Date(),
            },
        });
    }
}
