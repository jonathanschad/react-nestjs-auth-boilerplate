import { Controller, Post, HttpCode, HttpStatus, Res, Req, Query, Get, Body } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JWTService } from '@/auth/jwt.service';
import { AuthService } from '@/auth/auth.service';
import { SignupService } from '@/signup/signup.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { SkipAuth } from '@/auth/auth.guard';
import { ResendVerificationDto, SignupRequestDto, VerifyEmailTokenDto } from '@/signup/signup.dto';

@Controller('signup')
export class SignupController {
    constructor(
        private authService: AuthService,
        readonly prisma: PrismaService,
        readonly jwtService: JWTService,
        readonly signupService: SignupService,
    ) {}

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Post()
    async singup(@Body() body: SignupRequestDto, @Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);

        const result = await this.signupService.signupUser({
            ...body,
            language,
        });

        return { success: result };
    }

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Get('verify-email-token')
    async verifyEmailToken(
        @Res({ passthrough: true }) response: FastifyReply,
        @Query() { token }: VerifyEmailTokenDto,
    ) {
        if (!token) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Token missing' });
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));

        const user = await this.signupService.verifyEmailToken(token);
        return await this.authService.signInUser({ res: response, user, remember: false });
    }

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Post('resend-verification')
    async resendVerification(@Body() { email }: ResendVerificationDto, @Req() request: FastifyRequest) {
        const result = await this.signupService.resendVerification({
            email,
            language: this.signupService.getSupportedLanguageFromRequest(request),
        });
        return { success: result };
    }
}
