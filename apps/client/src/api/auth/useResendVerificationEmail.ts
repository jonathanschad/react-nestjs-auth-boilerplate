import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';

export const resendVerificationEmail = async ({ email }: { email: string }) => {
    try {
        const data = await api.post<{ success: boolean }>(`${BASE_URL}/signup/resend-verification`, { email });
        return data.data.success;
    } catch (_error) {
        return false;
    }
};

export const useResendVerificationEmail = () => {
    return useMutation(resendVerificationEmail);
};
