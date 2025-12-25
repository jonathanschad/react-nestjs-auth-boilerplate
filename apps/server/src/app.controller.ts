import { Language } from '@boilerplate/prisma';
import { api } from '@boilerplate/types';
import { logSomeStuff } from '@boilerplate/utils';
import { Controller, Get, Req } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
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
    @Implement(api.misc.getPrivacyPolicy)
    public getDataPrivacyPolicy(@Req() req: FastifyRequest) {
        return implement(api.misc.getPrivacyPolicy).handler(async () => {
            const language = this.signupService.getSupportedLanguageFromRequest(req);

            const policy = privacyPolicy.get(language) ?? privacyPolicy.get(Language.EN);
            return policy ?? '';
        });
    }

    @PublicRoute()
    @Implement(api.misc.getFrontendEnvs)
    public getFrontendEnvs() {
        return implement(api.misc.getFrontendEnvs).handler(async () => {
            return {
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
            };
        });
    }

    @Implement(api.misc.health)
    @PublicRoute()
    getHealth() {
        return implement(api.misc.health).handler(async () => {
            logSomeStuff();
            return {
                health: 'up',
                version: packageJson.version,
            };
        });
    }

    @Implement(api.misc.sentryTest)
    @PublicRoute()
    getSentryTest() {
        return implement(api.misc.sentryTest).handler(async () => {
            throw new Error('Test error');
        });
    }
}
