import type { UserUpdateablePropertiesDTO } from '@boilerplate/types';
import { useMutation, useQueryClient } from 'react-query';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { client } from '@/api/client';
import { invalidateQueriesMatchingAny } from '@/api/invalidate-queries';
import { getLoggedInUserQueryKey } from '@/api/user/user.queryKey';

export const updateUser = async (updates: UserUpdateablePropertiesDTO) => {
    const response = await client.user.updateUser(updates);
    return response;
};

export const useUpdateUser = (userUuid: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries(getUserQueryKey());
            await invalidateQueriesMatchingAny(queryClient, userUuid, ...getLoggedInUserQueryKey());
        },
    });
};
