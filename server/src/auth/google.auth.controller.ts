import { GoogleOAuthDTO } from '@/auth/auth.dto';
import { SkipAuth } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GoogleAuthService } from '@/auth/google.auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { ConnectGoogleAccountTokenService } from '@/database/connect-google-account-token/connect-google-account-token.service';
import { UserService } from '@/database/user/user.service';
import { SignupService } from '@/signup/signup.service';
import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly googleOAuthService: GoogleAuthService,
        private readonly signupService: SignupService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly jwtService: JWTService,
        private readonly connectGoogleAccountTokenService: ConnectGoogleAccountTokenService,
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

        const callbackUrl = new URL('/', this.appConfigService.frontendPublicUrl).href;

        try {
            const data = await this.googleOAuthService.exchangeAuthorizationCode(code);
            const profile = await this.googleOAuthService.fetchUserProfile(data);

            if (!profile.email || !profile.verified_email) {
                throw new Error('Invalid email');
            }

            const userByGoogleId = await this.userService.findByGoogleOAuthId(profile.id);
            if (userByGoogleId) {
                // User with this Google ID already exists therefore the user should be signed in
                await this.authService.signInUser({ res: reply, user: userByGoogleId, remember: true });
                return await reply.redirect(callbackUrl);
            }

            const userByEmail = await this.userService.findByEmail(profile.email);
            if (userByEmail) {
                // A user with this email already exists, a workflow to link the Google account to the existing user
                // should be started
                const { token, hashedSecret, expiresAt } = this.jwtService.generateRandomToken(
                    this.appConfigService.connectGoogleAccountTokenExpiry,
                    { googleOAuthId: profile.id, googleEmail: profile.email },
                );
                await this.connectGoogleAccountTokenService.createConnectGoogleAccountToken({
                    userId: userByEmail.id,
                    hashedSecret,
                    expiresAt,
                });
                const completeUrl = new URL('/google-oauth/connect-accounts', this.appConfigService.frontendPublicUrl);
                completeUrl.searchParams.append('connectToken', token);
                return await reply.redirect(completeUrl.href);
            }

            // The user does not exist, therefore a new user should be created
            await this.googleOAuthService.singUpWithGoogle(profile, language, reply);
            await reply.redirect(callbackUrl);
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            const errorUrl = new URL('/login', this.appConfigService.frontendPublicUrl).href;
            await reply.redirect(errorUrl);
        }
    }
}
