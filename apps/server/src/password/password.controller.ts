import type { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';

import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import {
    PasswordChangePasswordDto,
    PasswordChangeTokenDto,
    PasswordForgotDto,
    PasswordForgotValidateDto,
} from '@/password/password.dto';
import { PasswordService } from '@/password/password.service';
import { SignupService } from '@/signup/signup.service';

@Controller('password')
export class PasswordController {
    constructor(
        private readonly signupService: SignupService,
        private readonly passwordService: PasswordService,
        private readonly authService: AuthService,
    ) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('/forgot')
    async passwordForgot(@Body() { email }: PasswordForgotDto, @Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);
        await this.passwordService.initiatePasswordForgot({ email, language });

        return { success: true };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Get('/forgot/validate')
    async passwordForgotValidate(@Query() { token }: PasswordForgotValidateDto) {
        return { success: await this.passwordService.validatePasswordForgotToken(token) };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('/change-password/token')
    async passwordChangeToken(
        @Body() { token, password }: PasswordChangeTokenDto,
        @Res({ passthrough: true }) response: FastifyReply,
    ) {
        const { success, user } = await this.passwordService.changePasswordWithToken(token, password);
        if (success) {
            return await this.authService.signInUser({ res: response, user, remember: true });
        }
        return { success: success };
    }

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('/change-password/old-password')
    async passwordChangePassword(@Body() { email, newPassword, oldPassword }: PasswordChangePasswordDto) {
        return { success: await this.passwordService.changePasswordWithPassword(email, oldPassword, newPassword) };
    }
}
