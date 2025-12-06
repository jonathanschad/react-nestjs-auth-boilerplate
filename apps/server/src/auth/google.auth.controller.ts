import { api } from '@darts/types';
import { Controller, Get, HttpCode, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { GoogleOAuthDTO } from '@/auth/auth.dto';
import { PublicRoute } from '@/auth/auth.guard';
import { AuthService } from '@/auth/auth.service';
import { GoogleAuthService } from '@/auth/google.auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { ConnectGoogleAccountTokenService } from '@/database/connect-google-account-token/connect-google-account-token.service';
import { DatabaseUserService } from '@/database/user/user.service';
import { SignupService } from '@/signup/signup.service';

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
    ) {}

    @PublicRoute()
    @TsRestHandler(api.auth.startGoogleOAuth)
    public signIn() {
        return tsRestHandler(api.auth.startGoogleOAuth, async () => {
            const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.appConfigService.googleOAuthClientId}&redirect_uri=${this.googleOAuthService.buildGoogleOAuthRedirectUrl()}&response_type=code&scope=profile email`;
            return { status: 200 as const, body: { redirectUrl } };
        });
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
                // A user with this email already exists, the user will be connected to the Google account. This is safe
                // because if the user has control over the google account, they could just start the forget password
                // workflow.
                await this.googleOAuthService.updateUserProfileWithGooglePicture(userByEmail, profile.picture);
                await this.databaseUserService.connectGoogleAccount({
                    user: userByEmail,
                    googleOAuthId: profile.id,
                });

                await this.authService.signInUser({ res: reply, user: userByEmail, remember: true });

                return await reply.redirect(callbackUrl);
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
    @TsRestHandler(api.auth.completeGoogleAccountConnection)
    public completeAccountConnection(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
        return tsRestHandler(api.auth.completeGoogleAccountConnection, async ({ body }) => {
            const connectedUser = await this.googleOAuthService.completeAccountConnection({
                token: body.token,
                password: body.password,
            });

            if (!connectedUser) {
                return { status: 400 as const, body: { message: 'Failed to connect account' } };
            }

            const result = await this.authService.signInUser({
                res: res,
                user: connectedUser,
                remember: true,
            });

            return { status: 200 as const, body: result };
        });
    }
}
