import { api } from '@boilerplate/types';
import { Controller, Req, Res } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { SingInDTO } from '@/auth/auth.dto';
import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from '@/database/refresh-token/refresh-token.service';
import { InvalidRefreshTokenError } from '@/util/httpHandlers';

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly refreshTokenService: RefreshTokenService,
        readonly prisma: PrismaService,
        readonly jwtService: JWTService,
    ) {}

    @PublicRoute()
    @Implement(api.auth.login)
    public login(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.auth.login).handler(async ({ input }) => {
            const loginDto: SingInDTO = {
                email: input.email,
                password: input.password,
                remember: input.remember ?? false,
            };

            const result = await this.authService.signIn(res, loginDto);

            return result;
        });
    }

    @Implement(api.auth.logout)
    public logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.auth.logout).handler(async () => {
            const accessToken = this.jwtService.extractAccessTokenFromHeader(req);
            const refreshToken = this.jwtService.extractRefreshTokenFromCookie(req);
            await this.authService.logout({ response: res, accessToken, refreshToken });
            return { success: true };
        });
    }

    @PublicRoute()
    @Implement(api.auth.refreshToken)
    public refreshToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.auth.refreshToken).handler(async () => {
            try {
                const refreshToken = this.jwtService.extractRefreshTokenFromCookie(req);
                if (!refreshToken) {
                    throw new InvalidRefreshTokenError();
                }
                const refreshTokenDb = await this.refreshTokenService.findRefreshToken(refreshToken);
                if (!refreshTokenDb) {
                    throw new InvalidRefreshTokenError();
                }

                const accessToken = await this.authService.signInUser({
                    res: res,
                    user: refreshTokenDb.user,
                    refreshToken: refreshTokenDb.token,
                    remember: refreshTokenDb.rememberUser,
                });
                return accessToken;
            } catch (_error) {
                throw new InvalidRefreshTokenError();
            }
        });
    }
}
