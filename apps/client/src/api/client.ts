import { api as apiContract } from '@darts/types';
import { ApiFetcherArgs, initClient, tsRestFetchApi } from '@ts-rest/core';
import { z } from 'zod';
import { config } from '@/config';
import i18n from '@/i18n/i18n';
import { useStore } from '@/store/store';

export const BASE_URL = new URL('/api', config.BACKEND_URL).href;

let isRefreshingAccessTokenPromise: Promise<Response> | null = null;

const renewAccessToken = async (): Promise<{ accessToken: string }> => {
    try {
        if (!isRefreshingAccessTokenPromise) {
            const accessToken = useStore.getState().accessToken;
            isRefreshingAccessTokenPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        const result = await isRefreshingAccessTokenPromise;

        const data = z.object({ accessToken: z.string() }).parse(await result.json());

        useStore.getState().setAccessToken(data.accessToken);
        return data;
    } catch (error) {
        console.error('Token refresh failed:', error);
        useStore.getState().setAccessToken(null);

        throw error;
    } finally {
        isRefreshingAccessTokenPromise = null;
    }
};

// Create the ts-rest client using the axios instance with interceptors
// This ensures access token, refresh token, and language header logic is applied
export const tsRestClient = initClient(apiContract, {
    baseUrl: BASE_URL,
    baseHeaders: {},
    jsonQuery: true,
    api: async (args: ApiFetcherArgs) => {
        const accessToken = useStore.getState().accessToken;
        const isLoggedIn = useStore.getState().isLoggedIn;

        // Add authorization header if access token exists
        if (accessToken) {
            args.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Add language header if available
        if (i18n.language) {
            args.headers['Accept-Language'] = i18n.language;
        }

        try {
            const result = await tsRestFetchApi(args);

            if (result.status === 401 && isLoggedIn && !args.path.includes('refresh-token')) {
                const { accessToken: newAccessToken } = await renewAccessToken();

                if (newAccessToken) {
                    args.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                const retryResult = await tsRestFetchApi(args);
                return retryResult;
            }

            if (typeof result.body === 'object' && result.body && 'accessToken' in result.body) {
                const accessToken = z.object({ accessToken: z.string().nullable() }).parse(result.body).accessToken;
                useStore.getState().setAccessToken(accessToken);

                if (!accessToken) {
                    window.location.href = '/login';
                }
            }

            return result;
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    },
});
