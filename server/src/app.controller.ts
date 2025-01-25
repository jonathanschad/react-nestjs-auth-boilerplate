import { Controller, Get, Req } from '@nestjs/common';
import { PublicRoute } from '@/auth/auth.guard';
import licensesJSON from '@/assets/licenses.json';
import { AppConfigService } from '@/config/app-config.service';
import privacyPolicy from '@/assets/privacy-policy';
import { SignupService } from '@/signup/signup.service';
import { FastifyRequest } from 'fastify';
import { Language } from '@prisma/client';

@Controller()
export class AppController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly signupService: SignupService,
    ) {}

    @Get('/legal/attribution')
    @PublicRoute()
    async getLegalAttribution() {
        return licensesJSON;
    }

    @Get('/legal/privacy-policy')
    @PublicRoute()
    async getDataPrivacyPolicy(@Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);

        return privacyPolicy.get(language) ?? privacyPolicy.get(Language.EN);
    }

    @Get('/envs')
    @PublicRoute()
    async getFrontendEnvs() {
        return {
            BACKEND_URL: new URL('/api', this.appConfigService.backendPublicUrl).href,
            PUBLIC_URL: this.appConfigService.frontendPublicUrl,
            PLAUSIBLE_HOST_URL: this.appConfigService.plausibleHostUrl,
            SENTRY_FRONTEND_DSN: this.appConfigService.sentryFrontendDsn,
            ENVIRONMENT_NAME: this.appConfigService.nodeEnv,
        };
    }

    @Get('/health')
    @PublicRoute()
    async getHealth() {
        return {
            health: 'up',
            version: process.env.npm_package_version,
        };
    }
}
