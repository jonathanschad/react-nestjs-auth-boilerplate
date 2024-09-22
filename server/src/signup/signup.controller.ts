import { Controller, Post, HttpCode, HttpStatus, Res, Req, Query, Get, Body } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { JWTService } from '@/auth/jwt.service';
import { AuthService } from '@/auth/auth.service';
import { SignupService } from '@/signup/signup.service';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { RequireUserState, SkipAuth, User } from '@/auth/auth.guard';
import {
    CompleteSignupRequestDto,
    ResendVerificationDto,
    SignupRequestDto,
    VerifyEmailTokenDto,
} from '@/signup/signup.dto';
import { UserState } from '@prisma/client';
import { UserWithSettings } from '@/types/prisma';

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
    async signup(@Body() body: SignupRequestDto, @Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);

        const result = await this.signupService.signupUser({
            ...body,
            language,
        });

        return { success: result };
    }

    @RequireUserState(UserState.VERIFIED)
    @HttpCode(HttpStatus.OK)
    @Post('/complete')
    async completeSignup(
        @Body() body: CompleteSignupRequestDto,
        @Res({ passthrough: true }) res: FastifyReply,
        @User() user: UserWithSettings,
    ) {
        await this.signupService.completeVerifiedUser({
            ...body,
            id: user.id,
        });

        return await this.authService.signInUser({ res: res, user, remember: true });
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
        return await this.authService.signInUser({ res: response, user, remember: true });
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
