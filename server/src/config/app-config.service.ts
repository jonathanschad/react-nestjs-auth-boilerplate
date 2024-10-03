import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import assert from 'assert';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get(key: string): string {
        const envValue = this.configService.get(key);
        assert(envValue, `Config error: ${key} is not defined`);
        return envValue;
    }

    get databaseUrl(): string {
        return this.get('DATABASE_URL');
    }

    get nodeEnv(): string {
        return this.get('NODE_ENV');
    }

    get port(): number {
        return parseInt(this.get('PORT'));
    }

    get host(): string {
        return this.get('HOST');
    }

    get protocol(): string {
        return this.get('PROTOCOL');
    }

    get publicUrl(): string {
        return `${this.protocol}://${this.host}:${this.port}`;
    }

    get frontendPublicUrl(): string {
        return this.get('FRONTEND_PUBLIC_URL');
    }

    get jwtTokenSecret(): string {
        return this.get('JWT_TOKEN_SECRET');
    }

    get jwtOrigin(): string {
        return this.get('JWT_ORIGIN');
    }

    get accessTokenExpiry(): number {
        return parseInt(this.get('ACCESS_TOKEN_EXPIRY'));
    }

    get refreshTokenExpiry(): number {
        return parseInt(this.get('REFRESH_TOKEN_EXPIRY'));
    }

    get emailVerificationTokenExpiry(): number {
        return parseInt(this.get('EMAIL_VERIFICATION_TOKEN_EXPIRY'));
    }

    get emailVerificationResendInterval(): number {
        return parseInt(this.get('EMAIL_VERIFICATION_RESEND_INTERVAL'));
    }

    get passwordResetTokenExpiry(): number {
        return parseInt(this.get('PASSWORT_RESET_TOKEN_EXPIRY'));
    }

    get connectGoogleAccountTokenExpiry(): number {
        return parseInt(this.get('CONNECT_GOOGLE_ACCOUNT_TOKEN_EXPIRY'));
    }

    get smtpHost(): string {
        return this.get('SMTP_HOST');
    }

    get smtpPort(): number {
        return parseInt(this.get('SMTP_PORT'));
    }

    get smtpUser(): string {
        return this.get('SMTP_USER');
    }

    get smtpPassword(): string {
        return this.get('SMTP_PASSWORD');
    }

    get imprintContact1(): string {
        return this.get('IMPRINT_CONTACT_1');
    }

    get imprintContact2(): string {
        return this.get('IMPRINT_CONTACT_2');
    }

    get imprintContact3(): string {
        return this.get('IMPRINT_CONTACT_3');
    }

    get imprintContact4(): string {
        return this.get('IMPRINT_CONTACT_4');
    }

    get imprintCopyright(): string {
        return this.get('IMPRINT_COPYRIGHT');
    }

    get socials(): { name: string; url: string }[] {
        const socials: { name: string; url: string }[] = [];

        while (true) {
            try {
                const name = this.get(`SOCIAL_${socials.length + 1}_NAME`);
                const url = this.get(`SOCIAL_${socials.length + 1}_URL`);

                if (!name || !url) {
                    break;
                }
                socials.push({ name, url });
            } catch {
                break;
            }
        }

        return socials;
    }

    get googleOAuthClientId(): string {
        return this.get('GOOGLE_OAUTH_CLIENT_ID');
    }

    get googleOAuthClientSecret(): string {
        return this.get('GOOGLE_OAUTH_CLIENT_SECRET');
    }

    get googleOAuthRedirectUri(): string {
        return this.get('GOOGLE_OAUTH_REDIRECT_URI');
    }

    get fileStoragePath(): string {
        return this.get('FILE_STORAGE_PATH');
    }
}
