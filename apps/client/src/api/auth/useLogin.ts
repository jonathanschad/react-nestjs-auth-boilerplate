import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';
import type { LoginFormValues } from '@/forms/login-form';

export const login = async ({ email, password, remember }: LoginFormValues) => {
    const response = await tsRestClient.auth.login({
        body: { email, password, remember },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Login failed');
};

export const useLogin = () => {
    return useMutation(login);
};
