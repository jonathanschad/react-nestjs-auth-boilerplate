import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

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

export const miscContract = c.router({
    getPrivacyPolicy: {
        method: 'GET',
        path: '/legal/privacy-policy',
        responses: {
            200: z.string(),
        },
        query: z.object({}),
        summary: 'Get privacy policy',
    },
    getFrontendEnvs: {
        method: 'GET',
        path: '/envs',
        responses: {
            200: frontendEnvsResponseSchema,
        },
        query: z.object({}),
        summary: 'Get frontend environment variables',
    },
});
