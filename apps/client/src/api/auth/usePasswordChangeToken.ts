import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';

export type PasswordChangeTokenDto = {
    token: string;
    password: string;
};

export const passwordChangeToken = async (payload: PasswordChangeTokenDto) => {
    const response = await tsRestClient.auth.passwordChangeToken({
        body: payload,
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to change password');
};

export const usePasswordChangeToken = () => {
    return useMutation(passwordChangeToken);
};
