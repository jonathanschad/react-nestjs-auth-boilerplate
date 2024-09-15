import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { AppConfigService } from '@/config/app-config.service';
import { Language, UserState } from '@prisma/client';
import { UserService } from '@/database/user/user.service';
import { PasswordResetTokenService } from '@/database/password-reset-token/password-reset-token.service';
import { JWTService } from '@/auth/jwt.service';
import { UserWithSettings } from '@/types/prisma';
import { FastifyReply } from 'fastify';
import assert from 'assert';
import { AuthService } from '@/auth/auth.service';

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

    public async singUpOrLoginWithGoogle(
        { email, name, id }: GoogleUserProfileResponse,
        language: Language,
        response: FastifyReply,
    ) {
        let user: UserWithSettings | null = null;
        try {
            user = await this.userService.findByGoogleOAuthId(id);
        } catch (error) {
            // User does not exist --> create user
            user = await this.userService.findByEmail(email);

            if (user) {
                throw new Error(
                    'User already exists with this email. Please login with your email and password. And connect your Google account in the settings.',
                );
            }

            user = await this.userService.create({
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
        }
        assert(user);

        if (!user.googleOAuthId) {
            throw new Error('User is not connected with Google but the Account already exists');
        }

        return await this.authService.signInUser({
            res: response,
            user,
            remember: true,
        });
    }
}
