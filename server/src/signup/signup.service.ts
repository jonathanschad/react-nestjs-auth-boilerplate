import { Injectable } from '@nestjs/common';
import { UserService } from '@/database/user/user.service';
import { PrismaService } from '@/database/prisma.service';
import { FastifyRequest } from 'fastify';
import { Language, Prisma, User } from '@prisma/client';
import * as uuid from 'uuid';
import HttpStatusCode, { HTTPError } from '@/util/httpHandlers';
import { AuthService } from '@/auth/auth.service';
import { MailService } from '@/mail/mail.service';
import { UserWithSettings } from '@/types/prisma';
import { AppConfigService } from '@/config/app-config.service';
import { JWTService } from '@/auth/jwt.service';
import { EmailVerificationTokenService } from '@/database/email-verification-token/email-verification-token.service';
import { SignupRequestDto } from '@/signup/signup.dto';

@Injectable()
export class SignupService {
    constructor(
        private readonly userService: UserService,
        private readonly emailVerificationTokenService: EmailVerificationTokenService,
        private readonly appConfigService: AppConfigService,
        private readonly jwtService: JWTService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        readonly prisma: PrismaService,
    ) {}

    public async signupUser({
        email,
        password,
        name,
        acceptAgb,
        language,
    }: {
        language: Language;
    } & SignupRequestDto) {
        const salt = uuid.v4();

        if (!email || !password || !name || !acceptAgb) {
            throw new HTTPError({ statusCode: HttpStatusCode.BAD_REQUEST, message: 'Incomplete Request' });
        }

        const hashedPassword = await this.authService.hashPassword(password, salt);

        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
            include: {
                settings: true,
            },
        });
        if (existingUser) {
            if (existingUser.isVerified) {
                await this.mailService.sendEmailAlreadyExistsEmail(existingUser);
            } else {
                await this.initiateEmailVerification(existingUser);
            }
            return true;
        } else {
            const user: Prisma.UserCreateInput = {
                email: email,
                name: name,
                password: hashedPassword,
                salt: salt,
                settings: {
                    create: {
                        notificationsEnabled: true,
                        language: language ? language : Language.EN,
                    },
                },
            };

            const createdUser = await this.prisma.user.create({
                data: user,
                include: {
                    settings: true,
                },
            });

            await this.initiateEmailVerification(createdUser);
        }
        return true;
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
        const user = this.userService.verifyUser(emailVerificationToken);

        return user;
    }

    public async resendVerification({ email, language }: { email: string; language: Language }): Promise<true> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            this.mailService.sendEmailDoesNotExistConformationMailEmail(email, language);
            return true;
        }
        if (!user.isVerified) {
            await this.initiateEmailVerification(user);
        } else {
            this.mailService.sendEmailAlreadyVerifiedEmail(user);
        }

        return true;
    }

    private async initiateEmailVerification(user: UserWithSettings): Promise<void> {
        const { token, secret, expiresAt } = this.jwtService.generateRandomToken(
            this.appConfigService.emailVerificationTokenExpiry,
            { email: user.email },
        );

        const lastestToken = await this.prisma.emailVerificationToken.findFirst({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        if (lastestToken) {
            if (
                (new Date().getTime() - lastestToken.createdAt.getTime()) / 1000 <
                this.appConfigService.emailVerificationResendInterval
            ) {
                throw new HTTPError({
                    statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
                    message: 'Email verification resend interval not reached',
                });
            }
        }

        await this.prisma.emailVerificationToken.updateMany({
            where: {
                userId: user.id,
            },
            data: {
                valid: false,
            },
        });
        await this.prisma.emailVerificationToken.create({
            data: {
                userId: user.id,
                hashedSecret: this.jwtService.getSha256Hash(secret),
                expiresAt,
            },
        });
        this.mailService.sendEmailConfirmationEmail(user, token);
    }
}
