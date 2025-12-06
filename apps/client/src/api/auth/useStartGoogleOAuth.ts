import { tsRestClient } from '@/api/client';

export const startGoogleOAuthFlow = async () => {
    const response = await tsRestClient.auth.startGoogleOAuth({
        query: {},
    });

    if (response.status === 200) {
        window.location.href = response.body.url;
    } else {
        throw new Error('Failed to start Google OAuth flow');
    }
};
