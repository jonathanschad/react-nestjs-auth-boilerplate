import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';

export const passwordForgotTokenValidation = async ({ token }: { token: string }) => {
    const data = await api.get<{ success: boolean }>(`${BASE_URL}/password/forgot/validate?token=${token}`);
    return data.data.success;
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
