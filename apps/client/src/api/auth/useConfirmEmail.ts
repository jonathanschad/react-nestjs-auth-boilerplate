import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getAuthQueryKey } from '@/api/auth/auth.queryKey';

export const confirmEmail = async ({ token }: { token?: string | null }) => {
    if (!token) return false;
    try {
        const data = await api.get<{ success: boolean }>(`${BASE_URL}/signup/verify-email-token?token=${token}`);
        return data.data.success;
    } catch (_error) {
        return false;
    }
};

export const useConfirmEmail = (token?: string | null) => {
    return useQuery([...getAuthQueryKey(), 'confirm-email', token], () => confirmEmail({ token }), {
        enabled: !!token,
    });
};
