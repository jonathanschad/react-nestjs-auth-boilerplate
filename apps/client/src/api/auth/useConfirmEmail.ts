import { useQuery } from 'react-query';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';
import { client } from '@/api/client';

export const confirmEmail = async ({ token }: { token?: string | null }) => {
    if (!token) return false;
    const response = await client.signup.verifyEmailToken({ token });
    return response.success;
};

export const useConfirmEmail = (token?: string | null) => {
    return useQuery([...getAuthQueryKey(), 'confirm-email', token], () => confirmEmail({ token }), {
        enabled: !!token,
    });
};
