import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from '@/auth/auth.guard';
import licensesJSON from '@/assets/licenses.json';
import { AppConfigService } from '@/config/app-config.service';

@Controller()
export class AppController {
    constructor(private readonly appConfigService: AppConfigService) {}

    @Get('/legal/attribution')
    @PublicRoute()
    async getLegalAttribution() {
        return licensesJSON;
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

    @Get('/debug-sentry')
    @PublicRoute()
    getError() {
        throw new Error('My first Sentry error 2!');
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
