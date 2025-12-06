import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';

export const resendVerificationEmail = async ({ email }: { email: string }) => {
    try {
        const response = await tsRestClient.auth.resendVerification({
            body: { email },
        });

        return response.status === 200 && response.body.success;
    } catch (_error) {
        return false;
    }
};

export const useResendVerificationEmail = () => {
    return useMutation(resendVerificationEmail);
};
