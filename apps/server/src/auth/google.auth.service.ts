import assert from 'assert';
import axios from 'axios';
import { FastifyReply } from 'fastify';
import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';

import { CompleteGoogleAccountConnectionDTO } from '@server/auth/auth.dto';
import { AuthService } from '@server/auth/auth.service';
import { JWTService } from '@server/auth/jwt.service';
import { AppConfigService } from '@server/config/app-config.service';
import { ConnectGoogleAccountTokenService } from '@server/database/connect-google-account-token/connect-google-account-token.service';
import { PasswordResetTokenService } from '@server/database/password-reset-token/password-reset-token.service';
import { DatabaseUserService } from '@server/database/user/user.service';
import { UserService } from '@server/user/user.service';
import HttpStatusCode, { HTTPError } from '@server/util/httpHandlers';
import { Language, UserState } from '@boilerplate/prisma';

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
        private readonly databaseUserService: DatabaseUserService,
        private readonly passwordResetTokenService: PasswordResetTokenService,
        private readonly jwtService: JWTService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly connectGoogleAccountTokenService: ConnectGoogleAccountTokenService,
    ) {}

    public buildGoogleOAuthRedirectUrl(): string {
        const url = new URL(this.appConfigService.googleOAuthRedirectUri, this.appConfigService.backendPublicUrl);

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
        { email, name, id, picture }: GoogleUserProfileResponse,
        language: Language,
        response: FastifyReply,
    ) {
        const user = await this.databaseUserService.create({
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

        const profilePicture = await axios.get<ArrayBufferLike>(picture, {
            responseType: 'arraybuffer',
        });
        const userWithPicture = await this.userService.updateUserProfilePicture({
            user,
            fileBuffer: Buffer.from(profilePicture.data),
            fileUuid: uuid.v4(),
        });

        return await this.authService.signInUser({
            res: response,
            user: userWithPicture,
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
        await this.connectGoogleAccountTokenService.invalidateConnectGoogleAccountTokensByUser(databaseToken.userId);

        const user = await this.databaseUserService.findByUuid(databaseToken.userId);
        const isPasswordCorrect = await this.authService.verifyPassword(user, password);
        if (!isPasswordCorrect) {
            throw new HTTPError({ statusCode: HttpStatusCode.UNAUTHORIZED, message: 'Wrong username or password' });
        }

        return await this.databaseUserService.connectGoogleAccount({
            user,
            googleOAuthId: decodedToken.googleOAuthId,
        });
    }
}
