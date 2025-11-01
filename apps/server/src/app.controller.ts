import { Language } from '@boilerplate/prisma';
import { logSomeStuff } from '@boilerplate/utils';
import { Controller, Get, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import licensesJSON from '@/assets/licenses.json';
import privacyPolicy from '@/assets/privacy-policy';
import { PublicRoute } from '@/auth/auth.guard';
import { AppConfigService } from '@/config/app-config.service';
import { SignupService } from '@/signup/signup.service';
// eslint-disable-next-line no-restricted-imports
import packageJson from '../package.json';
@Controller()
export class AppController {
    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly signupService: SignupService,
    ) {}

    @Get('/legal/attribution')
    @PublicRoute()
    getLegalAttribution() {
        return licensesJSON;
    }

    @Get('/legal/privacy-policy')
    @PublicRoute()
    getDataPrivacyPolicy(@Req() request: FastifyRequest) {
        const language = this.signupService.getSupportedLanguageFromRequest(request);

        return privacyPolicy.get(language) ?? privacyPolicy.get(Language.EN);
    }

    @Get('/envs')
    @PublicRoute()
    getFrontendEnvs() {
        return {
            BACKEND_URL: new URL('/api', this.appConfigService.backendPublicUrl).href,
            PUBLIC_URL: this.appConfigService.frontendPublicUrl,
            PLAUSIBLE_HOST_URL: this.appConfigService.plausibleHostUrl,
            SENTRY_FRONTEND_DSN: this.appConfigService.sentryFrontendDsn,
            ENVIRONMENT_NAME: this.appConfigService.nodeEnv,
            IMPRINT_CONTACT_1: this.appConfigService.imprintContact1,
            IMPRINT_CONTACT_2: this.appConfigService.imprintContact2,
            IMPRINT_CONTACT_3: this.appConfigService.imprintContact3,
            IMPRINT_CONTACT_4: this.appConfigService.imprintContact4,
            IMPRINT_COPYRIGHT: this.appConfigService.imprintCopyright,
        };
    }

    @Get('/health')
    @PublicRoute()
    getHealth() {
        logSomeStuff();
        return {
            health: 'up',
            version: packageJson.version,
        };
    }

    @Get('/sentry-test')
    @PublicRoute()
    getSentryTest() {
        throw new Error('Test error');
    }
}
