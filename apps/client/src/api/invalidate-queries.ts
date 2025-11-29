import type { QueryClient } from 'react-query';

export const invalidateQueriesMatchingAll = async (queryClient: QueryClient, ...keys: string[]) => {
    await queryClient.invalidateQueries({
        predicate: ({ queryKey }) => keys.every((key) => queryKey.includes(key)),
    });
};

export const invalidateQueriesMatchingAny = async (queryClient: QueryClient, ...keys: string[]) => {
    await queryClient.invalidateQueries({
        predicate: ({ queryKey }) => keys.some((key) => queryKey.includes(key)),
    });
};
