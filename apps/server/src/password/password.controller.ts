import { api } from '@darts/types';
import { Controller, Req, Res } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { HttpStatusCode } from 'axios';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { PasswordService } from '@/password/password.service';
import { SignupService } from '@/signup/signup.service';
import { HTTPError } from '@/util/httpHandlers';

@Controller()
export class PasswordController {
    constructor(
        private readonly signupService: SignupService,
        private readonly passwordService: PasswordService,
        private readonly authService: AuthService,
    ) {}

    @PublicRoute()
    @Implement(api.password.passwordForgot)
    public passwordForgot(@Req() req: FastifyRequest) {
        return implement(api.password.passwordForgot).handler(async ({ input }) => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);
            await this.passwordService.initiatePasswordForgot({ email: input.email, language });

            return { success: true };
        });
    }

    @PublicRoute()
    @Implement(api.password.passwordForgotValidate)
    public passwordForgotValidate() {
        return implement(api.password.passwordForgotValidate).handler(async ({ input }) => {
            const success = await this.passwordService.validatePasswordForgotToken(input.token);
            return { success };
        });
    }

    @PublicRoute()
    @Implement(api.password.passwordChangeToken)
    public passwordChangeToken(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.password.passwordChangeToken).handler(async ({ input }) => {
            const { success, user } = await this.passwordService.changePasswordWithToken(input.token, input.password);
            if (success) {
                const result = await this.authService.signInUser({ res: res, user, remember: true });
                return result;
            }
            throw new HTTPError({ statusCode: HttpStatusCode.BadRequest, message: 'Failed to change password' });
        });
    }
}
