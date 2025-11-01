import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import type { AppConfigService } from '@/config/app-config.service';
// eslint-disable-next-line no-restricted-imports
import packageJson from '../package.json';

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
