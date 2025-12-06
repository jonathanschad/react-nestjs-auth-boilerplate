import { Language } from '@darts/prisma';
import { api } from '@darts/types';
import { logSomeStuff } from '@darts/utils';
import { Controller, Get, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
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

    @PublicRoute()
    @TsRestHandler(api.misc.getPrivacyPolicy)
    public getDataPrivacyPolicy(@Req() req: FastifyRequest) {
        return tsRestHandler(api.misc.getPrivacyPolicy, async () => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);

            const policy = privacyPolicy.get(language) ?? privacyPolicy.get(Language.EN);
            return { status: 200 as const, body: policy ?? '' };
        });
    }

    @PublicRoute()
    @TsRestHandler(api.misc.getFrontendEnvs)
    public getFrontendEnvs() {
        return tsRestHandler(api.misc.getFrontendEnvs, async () => {
            return {
                status: 200 as const,
                body: {
                    BACKEND_URL: new URL('/api', this.appConfigService.backendPublicUrl).href,
                    PUBLIC_URL: this.appConfigService.frontendPublicUrl,
                    PLAUSIBLE_HOST_URL: this.appConfigService.plausibleHostUrl ?? undefined,
                    SENTRY_FRONTEND_DSN: this.appConfigService.sentryFrontendDsn ?? undefined,
                    ENVIRONMENT_NAME: this.appConfigService.nodeEnv,
                    IMPRINT_CONTACT_1: this.appConfigService.imprintContact1,
                    IMPRINT_CONTACT_2: this.appConfigService.imprintContact2,
                    IMPRINT_CONTACT_3: this.appConfigService.imprintContact3,
                    IMPRINT_CONTACT_4: this.appConfigService.imprintContact4,
                    IMPRINT_COPYRIGHT: this.appConfigService.imprintCopyright,
                },
            };
        });
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
