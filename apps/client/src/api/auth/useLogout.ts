import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';

export const logout = async () => {
    const data = await api.post(`${BASE_URL}/auth/logout`);

    return data;
};

export const useLogout = () => {
    return useMutation(logout);
};
