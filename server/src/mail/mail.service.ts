import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AppConfigService } from '@/config/app-config.service';
import { Language } from '@prisma/client';
import { UserWithSettings } from '@/types/prisma';
import { templates } from '@/mail/templates/templates';
import { generateSocials } from '@/mail/templates/generate-socials';
import * as path from 'path';
export interface MailTemplate {
    template: string;
    translations: Record<Language, EmailTranslation>;
    images?: Attachment[];
}
export interface EmailTranslation {
    subject: string;
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
            resetPasswordLink: new URL(`/password-reset?token=${token}`, this.appConfigService.publicUrl).href,
        });
    }

    public sendEmailConfirmationEmail(user: UserWithSettings, token: string): void {
        this.sendEmail('emailConfirmation', user, {
            confirmEmailLink: new URL(`/verify-email-token?token=${token}`, this.appConfigService.publicUrl).href,
        });
    }
    public sendEmailDoesNotExistConformationMailEmail(email: string, language: Language): void {
        this.sendEmailUnregistered(
            'emailDoesnotExistConfirmationMail',
            { email, language },
            {
                signupLink: new URL(`/signup`, this.appConfigService.publicUrl).href,
            },
        );
    }
    public sendEmailDoesNotExistPasswordResetEmail(email: string, language: Language): void {
        this.sendEmailUnregistered(
            'emailDoesnotExistPasswordReset',
            { email, language },
            {
                signupLink: new URL(`/signup`, this.appConfigService.publicUrl).href,
            },
        );
    }
    public sendPasswordChangedEmail(user: UserWithSettings): void {
        this.sendEmail('passwordChanged', user);
    }

    public sendEmailAlreadyExistsEmail(user: UserWithSettings): void {
        this.sendEmail('accountAlreadyExists', user, {
            loginLink: new URL(`/login`, this.appConfigService.publicUrl).href,
        });
    }

    public sendEmailAlreadyVerifiedEmail(user: UserWithSettings): void {
        this.sendEmail('emailAlreadyVerified', user, {
            loginLink: new URL(`/login`, this.appConfigService.publicUrl).href,
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

        const images = template.images ?? [];
        images.push(
            {
                cid: 'logo',
                filename: 'logo.png',
                path: path.join(__dirname, './templates/images/logo.png'),
            },
            ...this.appConfigService.socials.map((social) => ({
                cid: social.name,
                filename: `${social.name}.png`,
                path: path.join(__dirname, `./templates/images/${social.name}.png`),
            })),
        );

        const translation = template.translations[options.language];

        const socials = generateSocials(this.appConfigService.socials);

        const htmlContent = this.applyTranslation(template.template, {
            ...translation,
            ...otherKeys,
            contact1: this.appConfigService.imprintContact1,
            contact2: this.appConfigService.imprintContact2,
            contact3: this.appConfigService.imprintContact3,
            contact4: this.appConfigService.imprintContact4,
            socials,
            imprintCopyright: this.appConfigService.imprintCopyright,
        });

        const mailOptions: MailOptions = {
            from: this.appConfigService.smtpUser,
            to: options.email,
            subject: translation.subject,
            html: htmlContent,
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

    private applyTranslation(template: string, translation: EmailTranslation): string {
        let result = template;
        Object.keys(translation).forEach((key) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, translation[key]);
        });
        return result;
    }
}
