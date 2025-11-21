import { Language, type Prisma, TokenType, type User, UserState } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as uuid from 'uuid';

import { AuthService } from '@/auth/auth.service';
import { JWTService } from '@/auth/jwt.service';
import { AppConfigService } from '@/config/app-config.service';
import { EmailVerificationTokenService } from '@/database/email-verification-token/email-verification-token.service';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';
import { MailService } from '@/mail/mail.service';
import { SignupRequestDto } from '@/signup/signup.dto';
import type { UserWithSettings } from '@/types/prisma';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';

@Injectable()
export class SignupService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly emailVerificationTokenService: EmailVerificationTokenService,
        private readonly appConfigService: AppConfigService,
        private readonly jwtService: JWTService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        readonly prisma: PrismaService,
    ) {}

    public async signupUser({
        email,
        acceptPrivacyPolicy,
        language,
    }: {
        language: Language;
    } & SignupRequestDto) {
        if (!acceptPrivacyPolicy) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Incomplete Request' });
        }

        const existingUser = await this.databaseUserService.find({ email });

        if (existingUser) {
            if (existingUser.state === UserState.UNVERIFIED || existingUser.state === UserState.VERIFIED) {
                await this.initiateEmailVerification(existingUser);
            } else {
                this.mailService.sendEmailAlreadyExistsEmail(existingUser);
            }
            return true;
        } else {
            const user: Prisma.UserCreateInput = {
                email: email,
                settings: {
                    create: {
                        notificationsEnabled: true,
                        language: language ? language : Language.EN,
                    },
                },
            };

            const createdUser = await this.databaseUserService.create(user);

            await this.initiateEmailVerification(createdUser);
        }
        return true;
    }

    public async completeVerifiedUser({ name, password, id }: { name: string; password: string; id: string }) {
        const salt = uuid.v4();
        const hashedPassword = await this.authService.hashPassword(password, salt);

        await this.databaseUserService.completeVerifiedUser({
            hashedPassword,
            salt,
            id,
            name,
        });
    }

    public getSupportedLanguageFromRequest = (req: FastifyRequest): Language => {
        const languages = req.languages();

        for (const lang of languages) {
            const supportedLang = Object.values(Language).find((supportedLang) =>
                supportedLang.toLocaleLowerCase().startsWith(lang.toLocaleLowerCase()),
            );
            if (supportedLang) {
                return supportedLang;
            }
        }

        return Language.EN;
    };

    public async verifyEmailToken(token: string): Promise<User> {
        const decoded = await this.jwtService.verifyToken<{ secret: string }>(token);
        const secret = (decoded as { secret: string }).secret;
        if (!secret) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Invalid token' });
        }
        const hashedSecret = this.jwtService.getSha256Hash(secret);
        const emailVerificationToken =
            await this.emailVerificationTokenService.findEmailVerificationToken(hashedSecret);
        if (!emailVerificationToken) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Invalid token' });
        }

        await this.emailVerificationTokenService.invalidateEmailVerificationToken(hashedSecret);
        const user = this.databaseUserService.verifyUser(emailVerificationToken);

        return user;
    }

    public async resendVerification({ email, language }: { email: string; language: Language }): Promise<true> {
        const user = await this.databaseUserService.findByEmail(email);
        if (!user) {
            this.mailService.sendEmailDoesNotExistConformationMailEmail(email, language);
            return true;
        }

        // If the email is verified, but the user has not yet entered a password, we need to send the email again
        // We act as if the email has not yet been verified
        if (user.state === UserState.UNVERIFIED || user.state === UserState.VERIFIED) {
            await this.initiateEmailVerification(user);
        } else {
            this.mailService.sendEmailAlreadyVerifiedEmail(user);
        }
        // TODO add an email for inactive users

        return true;
    }

    private async initiateEmailVerification(user: UserWithSettings): Promise<void> {
        const { token, secret, expiresAt } = this.jwtService.generateRandomToken(
            this.appConfigService.emailVerificationTokenExpiry,
            { email: user.email },
        );

        const lastestToken = await this.prisma.token.findFirst({
            where: {
                type: TokenType.EMAIL_VERIFICATION,
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (lastestToken) {
            if (
                (Date.now() - lastestToken.createdAt.getTime()) / 1000 <
                this.appConfigService.emailVerificationResendInterval
            ) {
                throw new HTTPError({
                    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
                    message: 'Email verification resend interval not reached',
                });
            }
        }

        await this.prisma.token.updateMany({
            where: {
                userId: user.id,
                type: TokenType.EMAIL_VERIFICATION,
            },
            data: {
                valid: false,
            },
        });
        await this.prisma.token.create({
            data: {
                userId: user.id,
                hashedSecret: this.jwtService.getSha256Hash(secret),
                type: TokenType.EMAIL_VERIFICATION,
                expiresAt,
            },
        });
        this.mailService.sendEmailConfirmationEmail(user, token);
    }
}
