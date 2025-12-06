import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';

export const passwordForgot = async ({ email }: { email: string }): Promise<{ success: boolean }> => {
    const response = await tsRestClient.auth.passwordForgot({
        body: { email },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to request password reset');
};

export const usePasswordForgot = () => {
    return useMutation(passwordForgot);
};
