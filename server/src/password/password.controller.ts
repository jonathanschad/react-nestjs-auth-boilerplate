import { Controller, Post, HttpCode, HttpStatus, Req, Get, Body, Query, Res } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { SignupService } from '@/signup/signup.service';
import { SkipAuth } from '@/auth/auth.guard';
import { PasswordService } from '@/password/password.service';
import {
    PasswordChangePasswordDto,
    PasswordChangeTokenDto,
    PasswordForgotDto,
    PasswordForgotValidateDto,
} from '@/password/password.dto';
import { AuthService } from '@/auth/auth.service';

@Controller('password')
export class PasswordController {
    constructor(
        private readonly signupService: SignupService,
        private readonly passwordService: PasswordService,
        private readonly authService: AuthService,
    ) {}

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Post('/forgot')
    async passwordForgot(@Body() { email }: PasswordForgotDto, @Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);
        await this.passwordService.initiatePasswordForgot({ email, language });

        return { success: true };
    }

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Get('/forgot/validate')
    async passwordForgotValidate(@Query() { token }: PasswordForgotValidateDto) {
        return { success: await this.passwordService.validatePasswordForgotToken(token) };
    }

    @SkipAuth()
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

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Post('/change-password/old-password')
    async passwordChangePassword(@Body() { email, newPassword, oldPassword }: PasswordChangePasswordDto) {
        return { success: await this.passwordService.changePasswordWithPassword(email, oldPassword, newPassword) };
    }
}
