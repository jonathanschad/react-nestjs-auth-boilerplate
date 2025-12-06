import type { UserUpdateablePropertiesDTO } from '@darts/types';
import { useMutation, useQueryClient } from 'react-query';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { tsRestClient } from '@/api/client';
import { invalidateQueriesMatchingAny } from '@/api/invalidate-queries';
import { getLoggedInUserQueryKey } from '@/api/user/user.queryKey';

export const updateUser = async (updates: UserUpdateablePropertiesDTO) => {
    const response = await tsRestClient.user.updateUser({
        body: updates,
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to update user');
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
