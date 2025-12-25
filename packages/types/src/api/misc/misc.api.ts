import { oc } from '@orpc/contract';
import { z } from 'zod';

const frontendEnvsResponseSchema = z.object({
    BACKEND_URL: z.string(),
    PUBLIC_URL: z.string(),
    PLAUSIBLE_HOST_URL: z.string().optional(),
    SENTRY_FRONTEND_DSN: z.string().optional(),
    ENVIRONMENT_NAME: z.string(),
    IMPRINT_CONTACT_1: z.string().optional(),
    IMPRINT_CONTACT_2: z.string().optional(),
    IMPRINT_CONTACT_3: z.string().optional(),
    IMPRINT_CONTACT_4: z.string().optional(),
    IMPRINT_COPYRIGHT: z.string().optional(),
});

export const miscContract = {
    getPrivacyPolicy: oc.route({ method: 'GET', path: '/legal/privacy-policy' }).input(z.object({})).output(z.string()),
    getFrontendEnvs: oc.route({ method: 'GET', path: '/envs' }).input(z.object({})).output(frontendEnvsResponseSchema),
    health: oc
        .route({ method: 'GET', path: '/health' })
        .input(z.object({}))
        .output(z.object({ health: z.string(), version: z.string() })),
    sentryTest: oc.route({ method: 'GET', path: '/sentry-test' }).input(z.object({})).output(z.void()),
};
