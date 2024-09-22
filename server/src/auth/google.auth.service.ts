import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { AppConfigService } from '@/config/app-config.service';
import { Language, UserState } from '@prisma/client';
import { UserService } from '@/database/user/user.service';
import { PasswordResetTokenService } from '@/database/password-reset-token/password-reset-token.service';
import { JWTService } from '@/auth/jwt.service';
import { FastifyReply } from 'fastify';
import { AuthService } from '@/auth/auth.service';
import { CompleteGoogleAccountConnectionDTO } from '@/auth/auth.dto';
import { ConnectGoogleAccountTokenService } from '@/database/connect-google-account-token/connect-google-account-token.service';
import * as assert from 'assert';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';

type GoogleTokenExchangeResponse = {
    access_token: string;
    id_token: string;
};
type GoogleUserProfileResponse = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
};
@Injectable()
export class GoogleAuthService {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly userService: UserService,
        private readonly passwordResetTokenService: PasswordResetTokenService,
        private readonly jwtService: JWTService,
        private readonly authService: AuthService,
        private readonly connectGoogleAccountTokenService: ConnectGoogleAccountTokenService,
    ) {}

    public buildGoogleOAuthRedirectUrl(): string {
        const url = new URL(this.appConfigService.googleOAuthRedirectUri, this.appConfigService.publicUrl);

        return url.href;
    }

    public async exchangeAuthorizationCode(code: string): Promise<GoogleTokenExchangeResponse> {
        const { data } = await axios.post<GoogleTokenExchangeResponse>('https://oauth2.googleapis.com/token', {
            client_id: this.appConfigService.googleOAuthClientId,
            client_secret: this.appConfigService.googleOAuthClientSecret,
            code,
            redirect_uri: this.buildGoogleOAuthRedirectUrl(),
            grant_type: 'authorization_code',
        });

        return data;
    }

    public async fetchUserProfile(
        googleTokenExchangeResponse: GoogleTokenExchangeResponse,
    ): Promise<GoogleUserProfileResponse> {
        const { data: profile } = await axios.get<GoogleUserProfileResponse>(
            'https://www.googleapis.com/oauth2/v1/userinfo',
            {
                headers: { Authorization: `Bearer ${googleTokenExchangeResponse.access_token}` },
            },
        );

        console.log('Google User Profile:', profile);

        return profile;
    }

    public async singUpWithGoogle(
        { email, name, id }: GoogleUserProfileResponse,
        language: Language,
        response: FastifyReply,
    ) {
        const user = await this.userService.create({
            email,
            name,
            googleOAuthId: id,
            state: UserState.VERIFIED,
            settings: {
                create: {
                    notificationsEnabled: true,
                    language,
                },
            },
        });

        return await this.authService.signInUser({
            res: response,
            user,
            remember: true,
        });
    }

    public async completeAccountConnection({ password, token }: CompleteGoogleAccountConnectionDTO) {
        const decodedToken = await this.jwtService.verifyToken<{
            googleOAuthId: string;
            googleEmail: string;
            name: string;
            secret: string;
        }>(token);

        const databaseToken = await this.connectGoogleAccountTokenService.findConnectGoogleAccountToken(
            this.jwtService.getSha256Hash(decodedToken.secret),
        );
        assert(databaseToken);
        const user = await this.userService.findByUuid(databaseToken.userId);
        const isPasswordCorrect = await this.authService.verifyPassword(user, password);
        if (!isPasswordCorrect) {
            throw new HTTPError({ statusCode: HttpStatusCode.UNAUTHORIZED, message: 'Wrong username or password' });
        }

        return await this.userService.connectGoogleAccount({
            user,
            googleOAuthId: decodedToken.googleOAuthId,
        });
    }
}
