import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';

export const passwordForgot = async ({ email }: { email: string }): Promise<{ success: boolean }> => {
    const data = await api.post<{ success: boolean }>(`${BASE_URL}/password/forgot`, { email });

    return data.data;
};

export const usePasswordForgot = () => {
    return useMutation(passwordForgot);
};
