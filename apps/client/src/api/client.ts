import { api } from '@boilerplate/types';
import { createORPCClient, onSuccess } from '@orpc/client';
import type { ContractRouterClient } from '@orpc/contract';
import type { JsonifiedClient } from '@orpc/openapi-client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { z } from 'zod';
import { config } from '@/config';
import i18n from '@/i18n/i18n';
import { useStore } from '@/store/store';

export const BASE_URL = new URL('/api', config.BACKEND_URL).href;

let isRefreshingAccessTokenPromise: Promise<Response> | null = null;

export const renewAccessToken = async (): Promise<{ accessToken: string }> => {
    try {
        if (!isRefreshingAccessTokenPromise) {
            const accessToken = useStore.getState().accessToken;
            isRefreshingAccessTokenPromise = fetch(`${BASE_URL}/auth/refresh-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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

const link = new OpenAPILink(api, {
    url: BASE_URL,
    headers: () => {
        const accessToken = useStore.getState().accessToken;
        const headers: Record<string, string> = {};

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        if (i18n.language) {
            headers['Accept-Language'] = i18n.language;
        }

        return headers;
    },
    fetch: async (request, init) => {
        const response = await globalThis.fetch(request, {
            ...init,
            credentials: 'include',
        });
        if (response.status === 401 && useStore.getState().isLoggedIn) {
            // Check if this is not a refresh token request
            if (!request.url.includes('refresh-token')) {
                try {
                    await renewAccessToken();
                    // Retry the request by not calling next
                    return globalThis.fetch(request, {
                        ...init,
                        credentials: 'include',
                    });
                } catch (refreshError) {
                    console.error('Failed to refresh token:', refreshError);
                }
            }
        }

        return response;
    },

    interceptors: [
        onSuccess(async (responseData: unknown) => {
            if (typeof responseData === 'object' && responseData && 'accessToken' in responseData) {
                const accessToken = z.object({ accessToken: z.string().nullable() }).parse(responseData).accessToken;
                useStore.getState().setAccessToken(accessToken);

                if (!accessToken) {
                    window.location.href = '/login';
                }
            }
        }),
    ],
});

export const client: JsonifiedClient<ContractRouterClient<typeof api>> = createORPCClient(link);
