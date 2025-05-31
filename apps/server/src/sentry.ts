import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// eslint-disable-next-line no-restricted-imports
import packageJson from '../package.json';

import { AppConfigService } from '@/config/app-config.service';

export const initSentry = (appConfigService: AppConfigService) => {
    if (!appConfigService.sentryBackendDsn) {
        return;
    }

    Sentry.init({
        environment: appConfigService.nodeEnv,
        release: `react-nestjs-boilerplate@${packageJson.version}`,
        dsn: appConfigService.sentryBackendDsn,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
    });
};
