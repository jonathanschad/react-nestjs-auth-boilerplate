import api, { BASE_URL } from '@/api';

export const startGoogleOAuthFlow = async () => {
    const { redirectUrl } = (await api.get<{ redirectUrl: string }>(`${BASE_URL}/auth/google`)).data;
    window.location.href = redirectUrl;
};
