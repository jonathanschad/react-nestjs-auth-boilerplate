import { client } from '@/api/client';

export const startGoogleOAuthFlow = async () => {
    const response = await client.auth.google.startGoogleOAuth({});
    window.location.href = response.redirectUrl;
};
