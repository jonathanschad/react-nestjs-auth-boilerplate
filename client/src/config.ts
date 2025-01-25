export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? window.location.origin,
    PUBLIC_URL: import.meta.env.VITE_FRONTEND_URL,
    PLAUSIBLE_HOST_URL: null,
    SENTRY_FRONTEND_DSN: null,
    ENVIRONMENT_NAME: null,
    IMPRINT_CONTACT_1: '',
    IMPRINT_CONTACT_2: '',
    IMPRINT_CONTACT_3: '',
    IMPRINT_CONTACT_4: '',
    IMPRINT_COPYRIGHT: '',
};
