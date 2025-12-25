import { useQuery } from 'react-query';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';
import { client } from '@/api/client';

export const passwordForgotTokenValidation = async ({ token }: { token: string }) => {
    const response = await client.password.passwordForgotValidate({ token });
    return response.success;
};

export const usePasswordForgotTokenValidation = (token?: string) => {
    return useQuery(
        [...getAuthQueryKey(), 'password-forgot-token-validation', token],
        () => passwordForgotTokenValidation({ token: token! }),
        {
            enabled: !!token,
        },
    );
};
