import { api } from '@boilerplate/types';
import { Controller, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GoogleAuthService } from '@/auth/google.auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { ConnectGoogleAccountTokenService } from '@/database/connect-google-account-token/connect-google-account-token.service';
import { DatabaseUserService } from '@/database/user/user.service';
import { SignupService } from '@/signup/signup.service';
import { SlackService } from '@/slack/slack.service';
import { HTTPError } from '@/util/httpHandlers';

@Controller()
export class GoogleAuthController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly googleOAuthService: GoogleAuthService,
        private readonly signupService: SignupService,
        private readonly databaseUserService: DatabaseUserService,
        private readonly authService: AuthService,
        private readonly jwtService: JWTService,
        private readonly connectGoogleAccountTokenService: ConnectGoogleAccountTokenService,
        private readonly slackService: SlackService,
    ) {}

    @PublicRoute()
    @Implement(api.auth.google.startGoogleOAuth)
    public signIn() {
        return implement(api.auth.google.startGoogleOAuth).handler(async () => {
            const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.appConfigService.googleOAuthClientId}&redirect_uri=${this.googleOAuthService.buildGoogleOAuthRedirectUrl()}&response_type=code&scope=profile email`;
            return { redirectUrl };
        });
    }

    @PublicRoute()
    @HttpCode(HttpStatus.MOVED_PERMANENTLY)
    @Implement(api.auth.google.googleOAuthCallback)
    async callback(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
        return implement(api.auth.google.googleOAuthCallback).handler(async ({ input }) => {
            const { code } = input;
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
                    return { headers: { location: callbackUrl } };
                }

                const userByEmail = await this.databaseUserService.findByEmail(profile.email);

                if (userByEmail) {
                    // A user with this email already exists, the user will be connected to the Google account. This is safe
                    // because if the user has control over the google account, they could just start the forget password
                    // workflow.
                    await this.googleOAuthService.updateUserProfileWithGooglePicture(userByEmail, profile.picture);
                    await this.databaseUserService.connectGoogleAccount({
                        user: userByEmail,
                        googleOAuthId: profile.id,
                    });
                    await this.slackService.newPlayerSignupNotification({ player: userByEmail });

                    await this.authService.signInUser({ res: reply, user: userByEmail, remember: true });

                    return { headers: { location: callbackUrl } };
                }

                // The user does not exist, therefore a new user should be created
                await this.googleOAuthService.singUpWithGoogle(profile, language, reply);
                await this.slackService.newPlayerSignupNotification({ player: { name: profile.name } });

                return { headers: { location: callbackUrl } };
            } catch (error) {
                console.error('Error during Google OAuth callback:', error);
                const errorUrl = new URL('/login', this.appConfigService.frontendPublicUrl).href;
                return { headers: { location: errorUrl } };
            }
        });
    }

    @PublicRoute()
    @Implement(api.auth.google.completeGoogleAccountConnection)
    public completeAccountConnection(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return implement(api.auth.google.completeGoogleAccountConnection).handler(async ({ input }) => {
            const connectedUser = await this.googleOAuthService.completeAccountConnection({
                token: input.token,
                password: input.password,
            });

            if (!connectedUser) {
                throw new HTTPError({ statusCode: HttpStatus.BAD_REQUEST, message: 'Failed to connect account' });
            }

            const result = await this.authService.signInUser({
                res: res,
                user: connectedUser,
                remember: true,
            });

            return result;
        });
    }
}
