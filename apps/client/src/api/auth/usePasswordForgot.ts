import { useMutation } from 'react-query';
import { client } from '@/api/client';

export const passwordForgot = async ({ email }: { email: string }): Promise<{ success: boolean }> => {
    const response = await client.password.passwordForgot({ email });
    return response;
};

export const usePasswordForgot = () => {
    return useMutation(passwordForgot);
};
