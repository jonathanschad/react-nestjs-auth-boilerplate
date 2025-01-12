// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import { AppConfigService } from '@/config/app-config.service';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

export const initSentry = (appConfigService: AppConfigService) => {
    if (!appConfigService.sentryBackendDsn) {
        return;
    }

    Sentry.init({
        environment: appConfigService.nodeEnv,
        dsn: appConfigService.sentryBackendDsn,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
    });
};
