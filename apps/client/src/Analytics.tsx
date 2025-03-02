import * as Sentry from '@sentry/react';
import Plausible from 'plausible-tracker';
import { useEffect, useRef } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

import { config } from '@client/config';

// eslint-disable-next-line no-restricted-imports
import packageJson from '../package.json';

export const Analytics = () => {
    const plausible = useRef<ReturnType<typeof Plausible> | null>(null);
    const sentryClient = useRef<ReturnType<typeof Sentry.init> | null>(null);
    useEffect(() => {
        if (!config.PUBLIC_URL || !config.PLAUSIBLE_HOST_URL) return;

        plausible.current = Plausible({
            domain: config.PUBLIC_URL,
            apiHost: config.PLAUSIBLE_HOST_URL ?? undefined,
            trackLocalhost: true,
        });
        const cleanUp = plausible.current.enableAutoPageviews();

        return () => {
            cleanUp();
        };
    }, []);

    useEffect(() => {
        if (!config.SENTRY_FRONTEND_DSN || !config.ENVIRONMENT_NAME || sentryClient.current) return;

        console.log('Initializing Sentry');
        sentryClient.current = Sentry.init({
            dsn: config.SENTRY_FRONTEND_DSN,
            environment: config.ENVIRONMENT_NAME,
            release: `react-nestjs-boilerplate-frontend@${packageJson.version}`,
            integrations: [
                // See docs for support of different versions of variation of react router
                // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
                Sentry.reactRouterV6BrowserTracingIntegration({
                    useEffect,
                    useLocation,
                    useNavigationType,
                    createRoutesFromChildren,
                    matchRoutes,
                }),
                Sentry.replayIntegration(),
            ],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for tracing.
            // Learn more at
            // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
            tracesSampleRate: 1.0,

            // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
            tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

            // Capture Replay for 10% of all sessions,
            // plus for 100% of sessions with an error
            // Learn more at
            // https://docs.sentry.io/platforms/javascript/session-replay/configuration/#general-integration-configuration
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
    }, []);
    return null;
};
