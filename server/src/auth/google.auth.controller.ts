import { GoogleOAuthDTO } from '@/auth/auth.dto';
import { SkipAuth } from '@/auth/auth.guard';
import { GoogleAuthService } from '@/auth/google.auth.service';
import { AppConfigService } from '@/config/app-config.service';
import { SignupService } from '@/signup/signup.service';
import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly googleOAuthService: GoogleAuthService,
        private readonly signupService: SignupService,
    ) {}

    @SkipAuth()
    @HttpCode(HttpStatus.OK)
    @Get('/')
    async signIn() {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.appConfigService.googleOAuthClientId}&redirect_uri=${this.googleOAuthService.buildGoogleOAuthRedirectUrl()}&response_type=code&scope=profile email`;
        return { redirectUrl: url };
    }

    @SkipAuth()
    @HttpCode(HttpStatus.MOVED_PERMANENTLY)
    @Get('/callback')
    async callback(
        @Req() request: FastifyRequest,
        @Res() reply: FastifyReply,
        @Query() googleOAuthDTO: GoogleOAuthDTO,
    ) {
        const { code } = googleOAuthDTO;
        const language = this.signupService.getSupportedLanguageFromRequest(request);

        try {
            const data = await this.googleOAuthService.exchangeAuthorizationCode(code);
            const profile = await this.googleOAuthService.fetchUserProfile(data);

            if (!profile.email || !profile.verified_email) {
                throw new Error('Invalid email');
            }

            await this.googleOAuthService.singUpOrLoginWithGoogle(profile, language, reply);

            await reply.redirect(this.appConfigService.frontendPublicUrl);
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            const errorUrl = new URL('/login', this.appConfigService.frontendPublicUrl).href;
            await reply.redirect(errorUrl);
        }
    }
}
