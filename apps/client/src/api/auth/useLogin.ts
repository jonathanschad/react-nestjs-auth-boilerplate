import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';
import type { LoginFormValues } from '@/forms/login-form';

export const login = async ({ email, password, remember }: LoginFormValues) => {
    const data = await api.post(`${BASE_URL}/auth/login`, { email, password, remember }, { withCredentials: true });

    return data;
};

export const useLogin = () => {
    return useMutation(login);
};
