import { UserState } from '@darts/prisma';
import { api } from '@darts/types';
import { Controller, Req, Res } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PublicRoute, RequireUserState, User } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { PrismaService } from '@/database/prisma.service';
import { SignupService } from '@/signup/signup.service';
import type { UserWithSettings } from '@/types/prisma';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';

@Controller()
export class SignupController {
    constructor(
        private authService: AuthService,
        readonly prisma: PrismaService,
        readonly jwtService: JWTService,
        readonly signupService: SignupService,
    ) {}

    @PublicRoute()
    @TsRestHandler(api.auth.register)
    public signup(@Req() req: FastifyRequest) {
        return tsRestHandler(api.auth.register, async ({ body }) => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);

            const result = await this.signupService.signupUser({
                email: body.email,
                acceptPrivacyPolicy: body.acceptPrivacyPolicy,
                language,
            });

            return { status: 200 as const, body: { success: result } };
        });
    }

    @RequireUserState(UserState.VERIFIED)
    @TsRestHandler(api.auth.completeRegistration)
    public completeSignup(@User() user: UserWithSettings, @Res() res: FastifyReply) {
        return tsRestHandler(api.auth.completeRegistration, async ({ body }) => {
            await this.signupService.completeVerifiedUser({
                name: body.name,
                password: body.password,
                id: user.id,
            });

            const result = await this.authService.signInUser({ res: res, user, remember: true });
            return { status: 200 as const, body: result };
        });
    }

    @PublicRoute()
    @TsRestHandler(api.auth.verifyEmailToken)
    public verifyEmailToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return tsRestHandler(api.auth.verifyEmailToken, async ({ query }) => {
            if (!query.token) {
                throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Token missing' });
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));

            const user = await this.signupService.verifyEmailToken(query.token);
            const result = await this.authService.signInUser({ res: res, user, remember: true });
            return { status: 200 as const, body: result };
        });
    }

    @PublicRoute()
    @TsRestHandler(api.auth.resendVerification)
    public resendVerification(@Req() req: FastifyRequest) {
        return tsRestHandler(api.auth.resendVerification, async ({ body }) => {
            const result = await this.signupService.resendVerification({
                email: body.email,
                language: this.signupService.getSupportedLanguageFromRequest(req),
            });
            return { status: 200 as const, body: { success: result } };
        });
    }
}
