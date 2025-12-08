import { UserState } from '@darts/prisma';
import { api } from '@darts/types';
import { Controller, Req, Res } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
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
    @Implement(api.signup.register)
    public signup(@Req() req: FastifyRequest) {
        return implement(api.signup.register).handler(async ({ input }) => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);

            const result = await this.signupService.signupUser({
                email: input.email,
                acceptPrivacyPolicy: input.acceptPrivacyPolicy,
                language,
            });

            return { success: result };
        });
    }

    @RequireUserState(UserState.VERIFIED)
    @Implement(api.signup.completeRegistration)
    public completeSignup(@User() user: UserWithSettings, @Res() res: FastifyReply) {
        return implement(api.signup.completeRegistration).handler(async ({ input }) => {
            await this.signupService.completeVerifiedUser({
                name: input.name,
                password: input.password,
                id: user.id,
            });

            const result = await this.authService.signInUser({ res: res, user, remember: true });
            return result;
        });
    }

    @PublicRoute()
    @Implement(api.signup.verifyEmailToken)
    public verifyEmailToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.signup.verifyEmailToken).handler(async ({ input }) => {
            if (!input.token) {
                throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Token missing' });
            }

            await new Promise((resolve) => setTimeout(resolve, 5000));

            const user = await this.signupService.verifyEmailToken(input.token);
            const result = await this.authService.signInUser({ res: res, user, remember: true });
            return result;
        });
    }

    @PublicRoute()
    @Implement(api.signup.resendVerification)
    public resendVerification(@Req() req: FastifyRequest) {
        return implement(api.signup.resendVerification).handler(async ({ input }) => {
            const result = await this.signupService.resendVerification({
                email: input.email,
                language: this.signupService.getSupportedLanguageFromRequest(req),
            });
            return { success: result };
        });
    }
}
