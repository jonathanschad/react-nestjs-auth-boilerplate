import type { Language } from '@boilerplate/prisma';
import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

import type { AuthService } from '@/auth/auth.service';
import type { JWTService } from '@/auth/jwt.service';
import type { AppConfigService } from '@/config/app-config.service';
import type { PasswordResetTokenService } from '@/database/password-reset-token/password-reset-token.service';
import type { PrismaService } from '@/database/prisma.service';
import type { DatabaseUserService } from '@/database/user/user.service';
import type { MailService } from '@/mail/mail.service';
import type { UserWithSettings } from '@/types/prisma';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';

@Injectable()
export class PasswordService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly passwordResetTokenService: PasswordResetTokenService,
        private readonly appConfigService: AppConfigService,
        private readonly jwtService: JWTService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        readonly prisma: PrismaService,
    ) {}

    public async initiatePasswordForgot({ email, language }: { email: string; language: Language }): Promise<void> {
        const user = await this.databaseUserService.findByEmail(email);
        if (user) {
            await this.initiatePasswordReset(user);
        } else {
            this.mailService.sendEmailDoesNotExistPasswordResetEmail(email, language);
        }
    }

    public async changePasswordWithToken(token: string, password: string) {
        const decoded = await this.jwtService.verifyToken<{ secret: string }>(token);
        const secret = decoded.secret;

        const hashedSecret = this.jwtService.getSha256Hash(secret);
        const passwordResetToken = await this.passwordResetTokenService.findValidTokenBySecret(hashedSecret);
        if (!passwordResetToken) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Invalid token' });
        }
        await this.passwordResetTokenService.invalidatePasswordResetTokensFromUser(passwordResetToken.userId);

        await this.changePassword({ user: passwordResetToken.user, password });
        return { success: true, user: passwordResetToken.user };
    }

    public async changePasswordWithPassword(email: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.databaseUserService.findByEmail(email);

        if (!user || !(await this.authService.verifyPassword(user, oldPassword))) {
            throw new HTTPError({ statusCode: HttpStatusCode.UNAUTHORIZED, message: 'Email or Password is incorrect' });
        }

        if (user) {
            await this.changePassword({ user, password: newPassword });
        }

        return true;
    }

    public async validatePasswordForgotToken(token: string): Promise<boolean> {
        try {
            const decoded = await this.jwtService.verifyToken<{ secret: string }>(token);
            const hashedSecret = this.jwtService.getSha256Hash(decoded.secret);
            const passwordResetToken = await this.passwordResetTokenService.findValidTokenBySecret(hashedSecret);

            return Boolean(passwordResetToken?.valid);
        } catch (_error) {
            return false;
        }
    }

    public async changePassword({
        user,
        password,
        invalidateAllSessions = false,
    }: {
        user: UserWithSettings;
        password: string;
        invalidateAllSessions?: boolean;
    }): Promise<void> {
        const salt = uuid.v4();
        const hashedPassword = await this.authService.hashPassword(password, salt);
        await this.databaseUserService.changePassword({
            hashedPassword,
            salt,
            userId: user.id,
        });
        if (invalidateAllSessions) {
            await this.authService.invalidateAllSessions(user.id);
        }
        this.mailService.sendPasswordChangedEmail(user);
    }

    public async initiatePasswordReset(user: UserWithSettings): Promise<void> {
        const { token, secret, expiresAt } = this.jwtService.generateRandomToken(
            this.appConfigService.passwordResetTokenExpiry,
        );
        await this.passwordResetTokenService.createPasswordResetToken({
            userId: user.id,
            hashedSecret: this.jwtService.getSha256Hash(secret),
            expiresAt,
        });
        this.mailService.sendPasswordResetEmail(user, token);
    }
}
