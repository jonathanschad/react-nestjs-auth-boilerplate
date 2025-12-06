import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { sanitizedUserWithSettingsSchema } from '../../schemas';

const c = initContract();

// Request/Response schemas
const loginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    remember: z.boolean().optional(),
});

const loginResponseSchema = z.object({
    accessToken: z.string(),
});

const registerRequestSchema = z.object({
    email: z.string().email(),
    acceptPrivacyPolicy: z.boolean(),
});

const registerResponseSchema = z.object({
    success: z.boolean(),
});

const completeRegistrationRequestSchema = z.object({
    name: z.string().min(1),
    password: z.string().min(1),
});

const verifyEmailTokenQuerySchema = z.object({
    token: z.string(),
});

const resendVerificationRequestSchema = z.object({
    email: z.string().email(),
});

const passwordForgotRequestSchema = z.object({
    email: z.string().email(),
});

const passwordForgotValidateQuerySchema = z.object({
    token: z.string(),
});

const passwordForgotValidateResponseSchema = z.object({
    success: z.boolean(),
});

const passwordChangeTokenRequestSchema = z.object({
    token: z.string(),
    password: z.string(),
});

const startGoogleOAuthResponseSchema = z.object({
    redirectUrl: z.string().url(),
});

const completeGoogleAccountConnectionQuerySchema = z.object({
    code: z.string(),
    state: z.string(),
});

const completeGoogleAccountConnectionBodySchema = z.object({
    token: z.string(),
    password: z.string(),
});

export const authContract = c.router({
    login: {
        method: 'POST',
        path: '/auth/login',
        responses: {
            200: loginResponseSchema,
            401: z.object({ message: z.string() }),
        },
        body: loginRequestSchema,
        summary: 'Login with email and password',
    },
    logout: {
        method: 'POST',
        path: '/auth/logout',
        responses: {
            200: z.object({ success: z.boolean() }),
        },
        body: z.object({}),
        summary: 'Logout current user',
    },
    refreshToken: {
        method: 'GET',
        path: '/auth/refresh-token',
        responses: {
            200: z.object({ accessToken: z.string() }),
            401: z.object({ message: z.string() }),
        },
        query: z.object({}),
        summary: 'Refresh access token',
    },
    register: {
        method: 'POST',
        path: '/signup',
        responses: {
            200: registerResponseSchema,
            400: z.object({ message: z.string() }),
        },
        body: registerRequestSchema,
        summary: 'Register a new user',
    },
    completeRegistration: {
        method: 'POST',
        path: '/signup/complete',
        responses: {
            200: loginResponseSchema,
            400: z.object({ message: z.string() }),
        },
        body: completeRegistrationRequestSchema,
        summary: 'Complete user registration',
    },
    verifyEmailToken: {
        method: 'GET',
        path: '/signup/verify-email-token',
        responses: {
            200: z.object({ success: z.boolean() }),
            400: z.object({ message: z.string() }),
        },
        query: verifyEmailTokenQuerySchema,
        summary: 'Verify email token',
    },
    resendVerification: {
        method: 'POST',
        path: '/signup/resend-verification',
        responses: {
            200: registerResponseSchema,
            400: z.object({ message: z.string() }),
        },
        body: resendVerificationRequestSchema,
        summary: 'Resend verification email',
    },
    passwordForgot: {
        method: 'POST',
        path: '/password/forgot',
        responses: {
            200: z.object({ success: z.boolean() }),
        },
        body: passwordForgotRequestSchema,
        summary: 'Request password reset',
    },
    passwordForgotValidate: {
        method: 'GET',
        path: '/password/forgot/validate',
        responses: {
            200: passwordForgotValidateResponseSchema,
            400: z.object({ message: z.string() }),
        },
        query: passwordForgotValidateQuerySchema,
        summary: 'Validate password reset token',
    },
    passwordChangeToken: {
        method: 'POST',
        path: '/password/change-password/token',
        responses: {
            200: loginResponseSchema,
            400: z.object({ message: z.string() }),
        },
        body: passwordChangeTokenRequestSchema,
        summary: 'Change password with token',
    },
    getUser: {
        method: 'GET',
        path: '/user',
        responses: {
            200: sanitizedUserWithSettingsSchema,
            401: z.object({ message: z.string() }),
        },
        summary: 'Get current user',
    },
    startGoogleOAuth: {
        method: 'GET',
        path: '/auth/google/start',
        responses: {
            200: startGoogleOAuthResponseSchema,
        },
        summary: 'Start Google OAuth flow',
    },
    completeGoogleAccountConnection: {
        method: 'POST',
        path: '/auth/google/complete-account-connection',
        responses: {
            200: loginResponseSchema,
            400: z.object({ message: z.string() }),
        },
        body: completeGoogleAccountConnectionBodySchema,
        summary: 'Complete Google account connection',
    },
    googleOAuthCallback: {
        method: 'GET',
        path: '/auth/google/callback',
        responses: {
            200: loginResponseSchema,
            400: z.object({ message: z.string() }),
        },
        query: completeGoogleAccountConnectionQuerySchema,
        summary: 'Complete Google OAuth flow',
    },
});
