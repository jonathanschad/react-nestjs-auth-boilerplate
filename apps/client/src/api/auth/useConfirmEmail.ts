import { useQuery } from 'react-query';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';
import { tsRestClient } from '@/api/client';

export const confirmEmail = async ({ token }: { token?: string | null }) => {
    if (!token) return false;
    const response = await tsRestClient.auth.verifyEmailToken({
        query: { token },
    });

    if (response.status === 200) {
        return response.body.success;
    }

    throw new Error('Failed to confirm email');
};

export const useConfirmEmail = (token?: string | null) => {
    return useQuery([...getAuthQueryKey(), 'confirm-email', token], () => confirmEmail({ token }), {
        enabled: !!token,
    });
};
