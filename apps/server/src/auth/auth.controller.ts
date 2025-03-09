import { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { SingInDTO } from '@/auth/auth.dto';
import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { PrismaService } from '@/database/prisma.service';
import { RefreshTokenService } from '@/database/refresh-token/refresh-token.service';
import { InvalidRefreshTokenError } from '@/util/httpHandlers';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly refreshTokenService: RefreshTokenService,
        readonly prisma: PrismaService,
        readonly jwtService: JWTService,
    ) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: SingInDTO, @Res({ passthrough: true }) response: FastifyReply) {
        return await this.authService.signIn(response, signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: FastifyReply, @Req() request: FastifyRequest) {
        const accessToken = this.jwtService.extractAccessTokenFromHeader(request);
        const refreshToken = this.jwtService.extractRefreshTokenFromCookie(request);
        return await this.authService.logout({ response, accessToken, refreshToken });
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Get('refresh-token')
    async refreshToken(@Res({ passthrough: true }) response: FastifyReply, @Req() request: FastifyRequest) {
        try {
            const refreshToken = this.jwtService.extractRefreshTokenFromCookie(request);
            if (!refreshToken) {
                throw new InvalidRefreshTokenError();
            }
            const refreshTokenDb = await this.refreshTokenService.findRefreshToken(refreshToken);
            if (!refreshTokenDb) {
                throw new InvalidRefreshTokenError();
            }

            const accessToken = await this.authService.signInUser({
                res: response,
                user: refreshTokenDb.user,
                refreshToken: refreshTokenDb.token,
                remember: refreshTokenDb.rememberUser,
            });
            return accessToken;
        } catch (_error) {
            throw new InvalidRefreshTokenError();
        }
    }
}
