import { oc } from '@orpc/contract';
import { z } from 'zod';

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

const googleOAuthCallbackQuerySchema = z.object({
    code: z.string(),
});

const completeGoogleAccountConnectionBodySchema = z.object({
    token: z.string(),
    password: z.string(),
});

const googleContract = oc.prefix('/google').router({
    startGoogleOAuth: oc.route({ method: 'GET', path: '/start' }).output(startGoogleOAuthResponseSchema),
    completeGoogleAccountConnection: oc
        .route({ method: 'POST', path: '/complete-account-connection' })
        .input(completeGoogleAccountConnectionBodySchema)
        .output(loginResponseSchema),
    googleOAuthCallback: oc
        .route({ method: 'GET', path: '/callback', successStatus: 302, outputStructure: 'detailed' })
        .input(googleOAuthCallbackQuerySchema),
});

export const authContract = oc.prefix('/auth').router({
    login: oc.route({ method: 'POST', path: '/login' }).input(loginRequestSchema).output(loginResponseSchema),
    logout: oc
        .route({ method: 'POST', path: '/logout' })
        .input(z.object({}))
        .output(z.object({ success: z.boolean() })),
    refreshToken: oc.route({ method: 'GET', path: '/refresh-token' }).output(z.object({ accessToken: z.string() })),
    google: googleContract,
});

export const signupContract = oc.prefix('/signup').router({
    register: oc.route({ method: 'POST', path: '/' }).input(registerRequestSchema).output(registerResponseSchema),
    completeRegistration: oc
        .route({ method: 'POST', path: '/complete' })
        .input(completeRegistrationRequestSchema)
        .output(loginResponseSchema),
    verifyEmailToken: oc
        .route({ method: 'GET', path: '/verify-email-token' })
        .input(verifyEmailTokenQuerySchema)
        .output(z.object({ success: z.boolean() })),
    resendVerification: oc
        .route({ method: 'POST', path: '/resend-verification' })
        .input(resendVerificationRequestSchema)
        .output(registerResponseSchema),
});

export const passwordContract = oc.prefix('/password').router({
    passwordForgot: oc
        .route({ method: 'POST', path: '/forgot' })
        .input(passwordForgotRequestSchema)
        .output(z.object({ success: z.boolean() })),
    passwordForgotValidate: oc
        .route({ method: 'GET', path: '/forgot/validate' })
        .input(passwordForgotValidateQuerySchema)
        .output(passwordForgotValidateResponseSchema),
    passwordChangeToken: oc
        .route({ method: 'POST', path: '/change-password/token' })
        .input(passwordChangeTokenRequestSchema)
        .output(loginResponseSchema),
});
