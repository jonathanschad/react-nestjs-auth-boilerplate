import * as crypto from 'node:crypto';
import type { User } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';

import { AppConfigService } from '@/config/app-config.service';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';
import HttpStatusCode, { HTTPError, InvalidAccessTokenError } from '@/util/httpHandlers';

interface JWTData {
    userId: string;
    email: string;
}

@Injectable()
export class JWTService {
    constructor(
        readonly databaseUserService: DatabaseUserService,
        readonly appConfigService: AppConfigService,
        readonly prisma: PrismaService,
    ) {}

    public generateAccessToken = async (data: JWTData, refreshToken: string) => {
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

        const token = jwt.sign(data, this.appConfigService.jwtTokenSecret, {
            expiresIn: this.appConfigService.accessTokenExpiry,
        });
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.appConfigService.accessTokenExpiry);
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
    };
    public generateRefreshToken = async (userId: string, oldRefreshToken?: string, rememberUser?: boolean) => {
        const token = jwt.sign({}, this.appConfigService.jwtTokenSecret, {
            expiresIn: this.appConfigService.refreshTokenExpiry,
        });
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + this.appConfigService.refreshTokenExpiry);
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
    };

    public generateRandomToken = (expiresInSeconds: number, additionalJwtData?: Record<string, unknown>) => {
        const secret = crypto.randomBytes(64).toString('hex');
        const token = jwt.sign({ ...(additionalJwtData ?? {}), secret }, this.appConfigService.jwtTokenSecret, {
            expiresIn: expiresInSeconds,
        });
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

        return { token, secret, hashedSecret: this.getSha256Hash(secret), expiresAt };
    };

    public authenticateToken = async (req: FastifyRequest): Promise<User> => {
        const accessToken = this.extractAccessTokenFromHeader(req);

        if (accessToken == null) {
            throw new InvalidAccessTokenError();
        }
        const payload = await req.jwtVerify();
        const { userId } = payload as JWTData;

        try {
            const result = await this.prisma.accessToken.updateMany({
                where: { token: accessToken, userId, valid: true, expiresAt: { gte: new Date() } },
                data: { lastUsedAt: new Date() },
            });
            if (result.count === 0) {
                throw new InvalidAccessTokenError();
            }
            const user = await this.prisma.user.findFirstOrThrow({
                where: { id: userId },
                include: { settings: true },
            });

            return user;
        } catch (_error) {
            throw new InvalidAccessTokenError();
        }
    };

    public getSha256Hash = (data: string) => {
        return crypto.createHash('sha256').update(data).digest('hex');
    };

    public extractAccessTokenFromHeader(request: FastifyRequest): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const tokenValue = type === 'Bearer' ? token : undefined;

        if (tokenValue == null) {
            throw new InvalidAccessTokenError();
        }

        return tokenValue;
    }

    public extractRefreshTokenFromCookie(request: FastifyRequest): string | undefined {
        return request.cookies.refreshToken;
    }

    public verifyToken = async <T = unknown>(token: string): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            jwt.verify(token, this.appConfigService.jwtTokenSecret, (err: unknown, decoded: unknown) => {
                if (err) {
                    reject(new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Invalid token' }));
                }
                resolve(decoded as T);
            });
        });
    };
}
