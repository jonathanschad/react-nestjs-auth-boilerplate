import type { UserUpdateablePropertiesDTO } from '@darts/types/api/user/user.dto';
import { useMutation, useQueryClient } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { invalidateQueriesMatchingAny } from '@/api/invalidate-queries';

export const updateUser = async (updates: UserUpdateablePropertiesDTO) => {
    const data = await api.patch(`${BASE_URL}/user`, updates, {
        withCredentials: true,
    });

    return data;
};

export const useUpdateUser = (userUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries(getUserQueryKey());
            await invalidateQueriesMatchingAny(queryClient, userUuid);
        },
    });
};
