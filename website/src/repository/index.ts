import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { renewAccessToken } from '@/repository/auth';
import { useStore } from '@/store/store';

export const BASE_URL = 'http://localhost:3003/api';

export const handleAxiosError = (error: unknown) => {
    console.error(error);
};

// Create an instance of Axios
export const api = axios.create({
    baseURL: BASE_URL, // Change to your API base URL
    withCredentials: true, // Needed to send cookies over CORS
});

// Request interceptor to inject the JWT into headers of each request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = useStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// Response interceptor to handle automatic token refresh if token expired
api.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.accessToken !== undefined) {
            useStore.getState().setAccessToken(response.data.accessToken);

            if (response.data.refreshToken === null) {
                window.location.href = '/login';
            }
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest:
            | (InternalAxiosRequestConfig & {
                  _retry?: boolean;
              })
            | undefined = error.config;

        // Check if the response is 401 and the request has not been retried yet
        if (
            error.response?.status === 401 &&
            useStore.getState().isLoggedIn &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('refresh-token')
        ) {
            originalRequest._retry = true; // Mark this request as retried

            try {
                await renewAccessToken();
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
