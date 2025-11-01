import type { Language } from '@boilerplate/prisma';
import { Injectable } from '@nestjs/common';
import { renderToStaticMarkup, type TReaderDocument } from '@usewaypoint/email-builder';
import * as nodemailer from 'nodemailer';
import type { Attachment } from 'nodemailer/lib/mailer';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';
import type * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';

import type { AppConfigService } from '@/config/app-config.service';
import type { PrismaService } from '@/database/prisma.service';
import { defaultEmailTemplateFactory } from '@/mail/templates/default-template';
import { templates } from '@/mail/templates/templates';
import type { UserWithSettings } from '@/types/prisma';
export interface MailTemplate {
    templateFactory: (translations: any) => TReaderDocument; // TODO type this
    translations: Record<Language, EmailTranslation>;
    images: Attachment[];
    headlineIconUrl: string;
}
export interface EmailTranslation {
    subject: string;
    headline: string;
    contactHeadline: string;
    [key: string]: string;
}

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

    constructor(
        private readonly appConfigService: AppConfigService,
        readonly prisma: PrismaService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: appConfigService.smtpHost,
            port: appConfigService.smtpPort,
            auth: {
                user: appConfigService.smtpUser,
                pass: appConfigService.smtpPassword,
            },
        });
    }

    public sendPasswordResetEmail(user: UserWithSettings, token: string): void {
        this.sendEmail('passwordReset', user, {
            resetPasswordLink: new URL(`/password-reset?token=${token}`, this.appConfigService.frontendPublicUrl).href,
        });
    }

    public sendEmailConfirmationEmail(user: UserWithSettings, token: string): void {
        this.sendEmail('emailConfirmation', user, {
            confirmEmailLink: new URL(`/verify-email-token?token=${token}`, this.appConfigService.frontendPublicUrl)
                .href,
        });
    }
    public sendEmailDoesNotExistConformationMailEmail(email: string, language: Language): void {
        this.sendEmailUnregistered(
            'emailDoesNotExistConfirmationMail',
            { email, language },
            {
                signupLink: new URL(`/signup`, this.appConfigService.frontendPublicUrl).href,
            },
        );
    }
    public sendEmailDoesNotExistPasswordResetEmail(email: string, language: Language): void {
        this.sendEmailUnregistered(
            'emailDoesNotExistPasswordReset',
            { email, language },
            {
                signupLink: new URL(`/signup`, this.appConfigService.frontendPublicUrl).href,
            },
        );
    }
    public sendPasswordChangedEmail(user: UserWithSettings): void {
        this.sendEmail('passwordChanged', user);
    }

    public sendEmailAlreadyExistsEmail(user: UserWithSettings): void {
        this.sendEmail('accountAlreadyExists', user, {
            loginLink: new URL(`/login`, this.appConfigService.frontendPublicUrl).href,
        });
    }

    public sendEmailAlreadyVerifiedEmail(user: UserWithSettings): void {
        this.sendEmail('emailAlreadyVerified', user, {
            loginLink: new URL(`/login`, this.appConfigService.frontendPublicUrl).href,
        });
    }

    private sendEmail(email: keyof typeof templates, user: UserWithSettings, otherKeys?: Record<string, string>): void {
        this.sendEmailUnregistered(email, { email: user.email, language: user.settings.language }, otherKeys);
    }

    private sendEmailUnregistered(
        email: keyof typeof templates,
        options: { email: string; language: Language },
        otherKeys?: Record<string, string>,
    ): void {
        const template = templates[email];
        const socials = this.appConfigService.socials.map((social) => ({
            name: social.name.toLowerCase(),
            url: social.url.toLowerCase(),
        }));
        const images = template.images ?? [];
        images.push(
            {
                cid: 'logo',
                filename: 'logo.png',
                path: path.join(__dirname, './templates/images/logo.png'),
            },
            ...socials.map((social) => ({
                cid: social.name,
                filename: `${social.name}.png`,
                path: path.join(__dirname, `./templates/images/${social.name}.png`),
            })),
        );

        const translation = template.translations[options.language];

        const templateRoot = defaultEmailTemplateFactory({
            ...translation,
            iconUrl: template.headlineIconUrl,
            contact1: this.appConfigService.imprintContact1,
            contact2: this.appConfigService.imprintContact2,
            contact3: this.appConfigService.imprintContact3,
            contact4: this.appConfigService.imprintContact4,
            copyRight: this.appConfigService.imprintCopyright,
            socials,
        });
        const contentTemplate = template.templateFactory({ ...translation, ...otherKeys });

        const templateOptions = {
            ...templateRoot,
            ...contentTemplate,
        };
        const mailOptions: MailOptions = {
            from: this.appConfigService.smtpUser,
            to: options.email,
            subject: translation.subject,
            html: renderToStaticMarkup(templateOptions, { rootBlockId: 'root' }),
            attachments: template.images,
        };

        this.transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(`Error sending email: ${error}`);
            } else {
                console.log(`${String(email)} Email sent to ${options.email}`);
            }
        });
    }
}
