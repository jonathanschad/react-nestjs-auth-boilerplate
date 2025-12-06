import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';

export const logout = async () => {
    const response = await tsRestClient.auth.logout({
        body: {},
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Logout failed');
};

export const useLogout = () => {
    return useMutation(logout);
};
