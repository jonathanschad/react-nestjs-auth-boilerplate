import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import type { SanitizedUser } from '@/types/user';

export const getUser = async () => {
    try {
        const data = await api.get<SanitizedUser>(`${BASE_URL}/user`);
        return data.data;
    } catch (_error) {
        return null;
    }
};

export const useGetUser = () => {
    return useQuery(getUserQueryKey(), getUser);
};
