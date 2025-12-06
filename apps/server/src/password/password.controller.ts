import { api } from '@darts/types';
import { Controller, Req, Res } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { PasswordService } from '@/password/password.service';
import { SignupService } from '@/signup/signup.service';

@Controller()
export class PasswordController {
    constructor(
        private readonly signupService: SignupService,
        private readonly passwordService: PasswordService,
        private readonly authService: AuthService,
    ) {}

    @PublicRoute()
    @TsRestHandler(api.auth.passwordForgot)
    public passwordForgot(@Req() req: FastifyRequest) {
        return tsRestHandler(api.auth.passwordForgot, async ({ body }) => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);
            await this.passwordService.initiatePasswordForgot({ email: body.email, language });

            return { status: 200 as const, body: { success: true } };
        });
    }

    @PublicRoute()
    @TsRestHandler(api.auth.passwordForgotValidate)
    public passwordForgotValidate() {
        return tsRestHandler(api.auth.passwordForgotValidate, async ({ query }) => {
            const success = await this.passwordService.validatePasswordForgotToken(query.token);
            return { status: 200 as const, body: { success } };
        });
    }

    @PublicRoute()
    @TsRestHandler(api.auth.passwordChangeToken)
    public passwordChangeToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return tsRestHandler(api.auth.passwordChangeToken, async ({ body }) => {
            const { success, user } = await this.passwordService.changePasswordWithToken(body.token, body.password);
            if (success) {
                const result = await this.authService.signInUser({ res: res, user, remember: true });
                return { status: 200 as const, body: result };
            }
            return { status: 400 as const, body: { message: 'Failed to change password' } };
        });
    }
}
