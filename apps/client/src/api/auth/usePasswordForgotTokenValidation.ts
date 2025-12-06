import { useQuery } from 'react-query';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';
import { tsRestClient } from '@/api/client';

export const passwordForgotTokenValidation = async ({ token }: { token: string }) => {
    const response = await tsRestClient.auth.passwordForgotValidate({
        query: { token },
    });

    return response.status === 200 && response.body.success;
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
