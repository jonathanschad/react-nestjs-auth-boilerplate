import { useMutation } from 'react-query';
import { client } from '@/api/client';

export const resendVerificationEmail = async ({ email }: { email: string }) => {
    try {
        const response = await client.signup.resendVerification({ email });
        return response.success;
    } catch (_error) {
        return false;
    }
};

export const useResendVerificationEmail = () => {
    return useMutation(resendVerificationEmail);
};
