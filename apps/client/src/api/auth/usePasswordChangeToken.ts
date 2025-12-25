import { useMutation } from 'react-query';
import { client } from '@/api/client';

export type PasswordChangeTokenDto = {
    token: string;
    password: string;
};

export const passwordChangeToken = async (payload: PasswordChangeTokenDto) => {
    const response = await client.password.passwordChangeToken(payload);
    return response;
};

export const usePasswordChangeToken = () => {
    return useMutation(passwordChangeToken);
};
