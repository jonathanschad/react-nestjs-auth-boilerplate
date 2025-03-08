import { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';

import { CompleteGoogleAccountConnectionDTO, GoogleOAuthDTO } from '@server/auth/auth.dto';
import { PublicRoute } from '@server/auth/auth.guard';
import { AuthService } from '@server/auth/auth.service';
import { GoogleAuthService } from '@server/auth/google.auth.service';
import { JWTService } from '@server/auth/jwt.service';
import { AppConfigService } from '@server/config/app-config.service';
import { ConnectGoogleAccountTokenService } from '@server/database/connect-google-account-token/connect-google-account-token.service';
import { DatabaseUserService } from '@server/database/user/user.service';
import { SignupService } from '@server/signup/signup.service';

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly googleOAuthService: GoogleAuthService,
        private readonly signupService: SignupService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly authService: AuthService,
        private readonly jwtService: JWTService,
        private readonly connectGoogleAccountTokenService: ConnectGoogleAccountTokenService,
    ) {}

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Get('/')
    signIn() {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.appConfigService.googleOAuthClientId}&redirect_uri=${this.googleOAuthService.buildGoogleOAuthRedirectUrl()}&response_type=code&scope=profile email`;
        return { redirectUrl: url };
    }

    @PublicRoute()
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

            const userByGoogleId = await this.databaseUserService.findByGoogleOAuthId(profile.id);
            if (userByGoogleId) {
                // User with this Google ID already exists therefore the user should be signed in
                await this.authService.signInUser({ res: reply, user: userByGoogleId, remember: true });
                return await reply.redirect(callbackUrl);
            }

            const userByEmail = await this.databaseUserService.findByEmail(profile.email);
            if (userByEmail) {
                // A user with this email already exists, a workflow to link the Google account to the existing user
                // should be started
                const { token, hashedSecret, expiresAt } = this.jwtService.generateRandomToken(
                    this.appConfigService.connectGoogleAccountTokenExpiry,
                    { googleOAuthId: profile.id, googleEmail: profile.email, name: profile.name },
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

    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @Post('/complete-account-connection')
    async completeAccountConnection(
        @Res({ passthrough: true }) reply: FastifyReply,
        @Body() completeGoogleAccountConnectionDTO: CompleteGoogleAccountConnectionDTO,
    ) {
        const { token, password } = completeGoogleAccountConnectionDTO;

        const connectedUser = await this.googleOAuthService.completeAccountConnection({ token, password });

        if (!connectedUser) {
            return { success: false };
        }
        return await this.authService.signInUser({
            res: reply,
            user: connectedUser,
            remember: true,
        });
    }
}
