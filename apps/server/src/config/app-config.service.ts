import assert from 'node:assert';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService) {}

    get(key: string): string {
        const envValue = this.configService.get<string>(key);
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
        return parseInt(this.get('PORT'), 10);
    }

    get host(): string {
        return this.get('HOST');
    }

    get backendPublicUrl(): string {
        return this.get('VITE_BACKEND_URL');
    }

    get frontendPublicUrl(): string {
        return this.get('VITE_FRONTEND_URL');
    }

    get jwtTokenSecret(): string {
        return this.get('JWT_TOKEN_SECRET');
    }

    get jwtOrigin(): string {
        return this.get('JWT_ORIGIN');
    }

    get accessTokenExpiry(): number {
        return parseInt(this.get('ACCESS_TOKEN_EXPIRY'), 10);
    }

    get refreshTokenExpiry(): number {
        return parseInt(this.get('REFRESH_TOKEN_EXPIRY'), 10);
    }

    get emailVerificationTokenExpiry(): number {
        return parseInt(this.get('EMAIL_VERIFICATION_TOKEN_EXPIRY'), 10);
    }

    get emailVerificationResendInterval(): number {
        return parseInt(this.get('EMAIL_VERIFICATION_RESEND_INTERVAL'), 10);
    }

    get passwordResetTokenExpiry(): number {
        return parseInt(this.get('PASSWORT_RESET_TOKEN_EXPIRY'), 10);
    }

    get connectGoogleAccountTokenExpiry(): number {
        return parseInt(this.get('CONNECT_GOOGLE_ACCOUNT_TOKEN_EXPIRY'), 10);
    }

    get smtpHost(): string {
        return this.get('SMTP_HOST');
    }

    get smtpPort(): number {
        return parseInt(this.get('SMTP_PORT'), 10);
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

    get storageType(): 's3' | 'local' {
        const storageType = this.get('STORAGE_TYPE');
        if (storageType !== 's3' && storageType !== 'local') {
            throw new Error(`Config error: STORAGE_TYPE must be either "s3" or "local", got ${storageType}`);
        }

        return this.get('STORAGE_TYPE') as 's3' | 'local';
    }

    get fileStoragePath(): string {
        return this.get('FILE_SYSTEM_STORAGE_PATH');
    }

    get s3AccessKeyId(): string {
        return this.get('S3_ACCESS_KEY_ID');
    }

    get s3SecretAccessKey(): string {
        return this.get('S3_SECRET_ACCESS_KEY');
    }

    get s3BucketName(): string {
        return this.get('S3_BUCKET_NAME');
    }

    get s3Endpoint(): string {
        return this.get('S3_ENDPOINT');
    }

    get s3Region(): string {
        return this.get('S3_REGION');
    }

    get plausibleHostUrl(): string | null {
        try {
            return this.get('PLAUSIBLE_HOST_URL');
        } catch (_error) {
            return null;
        }
    }

    get sentryBackendDsn(): string | null {
        try {
            return this.get('BACKEND_SENTRY_DSN');
        } catch (_error) {
            return null;
        }
    }

    get sentryFrontendDsn(): string | null {
        try {
            return this.get('FRONTEND_SENTRY_DSN');
        } catch (_error) {
            return null;
        }
    }
}
