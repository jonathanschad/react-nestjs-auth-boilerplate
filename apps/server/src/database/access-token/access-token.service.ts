import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';

import { AccessToken, Prisma, UserState } from '@boilerplate/prisma';

import { AppConfigService } from '@/config/app-config.service';
import { PrismaService } from '@/database/prisma.service';
import { InvalidAccessTokenError } from '@/util/httpHandlers';

interface JWTData {
    userId: string;
    email: string;
    state: UserState;
}

@Injectable()
export class AccessTokenService {
    constructor(
        private prisma: PrismaService,
        private configService: AppConfigService,
    ) {}

    async find(accessTokenWhereUniqueInput: Prisma.AccessTokenWhereUniqueInput): Promise<AccessToken | null> {
        return this.prisma.accessToken.findUnique({
            where: accessTokenWhereUniqueInput,
        });
    }
    public async generateAccessToken(data: JWTData, refreshToken: string) {
        if (!refreshToken) throw new InvalidAccessTokenError();

        const refreshTokenDB = await this.prisma.refreshToken.findFirst({
            where: {
                token: refreshToken,
                valid: true,
                expiresAt: { gte: new Date() },
            },
        });
        if (!refreshTokenDB) {
            throw new InvalidAccessTokenError();
        }

        const token = jwt.sign({ ...data, salt: uuid.v4() }, this.configService.jwtTokenSecret, {
            expiresIn: this.configService.accessTokenExpiry,
        });
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.configService.accessTokenExpiry);
        await this.prisma.accessToken.create({
            data: {
                token,
                userId: data.userId,
                expiresAt,
                refreshTokenId: refreshTokenDB.refreshTokenId,
                valid: true,
            },
        });

        return token;
    }

    public async invalidateAccessToken(accessToken: string) {
        await this.prisma.accessToken.updateMany({
            where: {
                token: accessToken,
            },
            data: {
                valid: false,
                expiresAt: new Date(),
            },
        });
    }

    public async invalidateAccessTokensFromUser(userId: string) {
        await this.prisma.accessToken.updateMany({
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
