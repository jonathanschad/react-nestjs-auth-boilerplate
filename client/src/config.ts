export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? window.location.origin,
    PUBLIC_URL: import.meta.env.VITE_FRONTEND_URL,
    PLAUSIBLE_HOST_URL: null,
};
