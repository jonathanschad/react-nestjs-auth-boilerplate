import { Injectable } from '@nestjs/common';
import { DatabaseUserService } from '@server/database/user/user.service';
import { User } from '@boilerplate/prisma';
import * as crypto from 'crypto';
import { SingInDTO } from '@server/auth/auth.dto';
import { PrismaService } from '@server/database/prisma.service';
import HttpStatusCode, { HTTPError } from '@server/util/httpHandlers';
import { FastifyReply } from 'fastify';
import { AccessTokenService } from '@server/database/access-token/access-token.service';
import { RefreshTokenService } from '@server/database/refresh-token/refresh-token.service';
import { PasswordResetTokenService } from '@server/database/password-reset-token/password-reset-token.service';
import assert from 'assert';

@Injectable()
export class AuthService {
    constructor(
        private databaseUserService: DatabaseUserService,
        private accessTokenService: AccessTokenService,
        private refreshTokenService: RefreshTokenService,
        private readonly passwordResetTokenService: PasswordResetTokenService,
        readonly prisma: PrismaService,
    ) {}

    public async signIn(res: FastifyReply, { email, password, remember }: SingInDTO): Promise<any> {
        const FAIL_MESSAGE = 'Incorrect username or password.' as const;
        try {
            const user = await this.databaseUserService.findByEmail(email);
            assert(user);

            if (!(await this.verifyPassword(user, password))) {
                throw new HTTPError({ statusCode: HttpStatusCode.UNAUTHORIZED, message: FAIL_MESSAGE });
            }
            return await this.signInUser({ res, user, remember });
        } catch (error) {
            console.error(error);
            throw new HTTPError({ statusCode: HttpStatusCode.UNAUTHORIZED, message: FAIL_MESSAGE });
        }
    }

    public async logout({
        accessToken,
        refreshToken,
        response: res,
    }: {
        accessToken?: string;
        refreshToken?: string;
        response: FastifyReply;
    }) {
        if (accessToken) {
            await this.accessTokenService.invalidateAccessToken(accessToken);
        }

        if (refreshToken) {
            await this.refreshTokenService.invalidateRefreshToken(refreshToken);
        }

        void res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });
        return { success: true, accessToken: null };
    }

    public async invalidateAllSessions(userId: string): Promise<void> {
        await this.accessTokenService.invalidateAccessTokensFromUser(userId);
        await this.refreshTokenService.invalidateRefreshTokensFromUser(userId);
        await this.passwordResetTokenService.invalidatePasswordResetTokensFromUser(userId);
    }

    public async signInUser({
        res,
        user,
        refreshToken: oldRefreshToken,
        remember,
    }: {
        res: FastifyReply;
        user: User;
        refreshToken?: string;
        remember?: boolean;
    }): Promise<{ success: true; accessToken: string }> {
        const reloadedUser = await this.databaseUserService.findByUuid(user.id);

        const refreshToken = await this.refreshTokenService.createRefreshToken(
            reloadedUser.id,
            oldRefreshToken,
            remember,
        );
        const accessToken = await this.accessTokenService.generateAccessToken(
            { userId: reloadedUser.id, email: reloadedUser.email, state: reloadedUser.state },
            refreshToken,
        );

        this.setRefreshTokenCookie(res, refreshToken, remember);
        return { success: true, accessToken };
    }

    public async hashPassword(password: string, salt: string): Promise<Buffer> {
        return new Promise<Buffer>((res, rej) =>
            crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
                if (err) {
                    rej(err);
                }
                res(hashedPassword);
            }),
        );
    }

    public async verifyPassword(user: User, password: string): Promise<boolean> {
        assert(user.salt);
        assert(user.password);
        const hashedPassword = await this.hashPassword(password, user.salt);

        return crypto.timingSafeEqual(user.password, hashedPassword);
    }

    private setRefreshTokenCookie(res: FastifyReply, refreshToken: string, remember?: boolean) {
        void res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Important: makes the cookie inaccessible to client-side JavaScript
            secure: process.env.NODE_ENV === 'production', // Cookies sent over HTTPS only in production
            sameSite: 'strict', // Strictly same site
            path: '/api/auth/refresh-token', // Specify the path if needed
            maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : undefined, // Cookie expiration in milliseconds (matches token expiration)
        });
    }
}
