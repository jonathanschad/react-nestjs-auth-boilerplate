import { useMutation } from 'react-query';
import { client } from '@/api/client';

export const logout = async () => {
    const response = await client.auth.logout({});
    return response;
};

export const useLogout = () => {
    return useMutation(logout);
};
