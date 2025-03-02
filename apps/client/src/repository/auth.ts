import api from '@client/repository';
import { useStore } from '@client/store/store';

export const renewAccessToken = async () => {
    console.log('renewAccessToken');

    try {
        // Assuming your API provides a path to refresh tokens
        const refreshResponse = await api.get<{
            accessToken: string;
        }>('/auth/refresh-token', {
            withCredentials: true, // Ensure cookies are sent
        });
        useStore.getState().setAccessToken(refreshResponse.data.accessToken);
    } catch (refreshError) {
        useStore.getState().setAccessToken(null);
    }
};
