import { useMutation } from 'react-query';
import { client } from '@/api/client';
import type { LoginFormValues } from '@/forms/login-form';

export const login = async ({ email, password, remember }: LoginFormValues) => {
    const response = await client.auth.login({ email, password, remember });
    return response;
};

export const useLogin = () => {
    return useMutation(login);
};
