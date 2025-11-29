import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';

export type PasswordChangeTokenDto = {
    token: string;
    password: string;
};

export const passwordChangeToken = async (payload: PasswordChangeTokenDto) => {
    const data = await api.post<{ success: boolean }>(`${BASE_URL}/password/change-password/token`, payload);
    return data.data;
};

export const usePasswordChangeToken = () => {
    return useMutation(passwordChangeToken);
};
