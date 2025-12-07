import { GameFilter } from '@darts/types';
import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getGamesQueryKey } from '@/api/dart/game/games.queryKey';

export const getGames = async ({
    filter,
    page = 1,
    pageSize = 10,
}: {
    filter: GameFilter;
    page?: number;
    pageSize?: number;
}) => {
    const response = await client.dart.game.getGames({ ...filter, page, pageSize });
    return response;
};

export const useGetGames = (filter: GameFilter, page: number = 1, pageSize: number = 10) => {
    const playerQuery = useQuery(
        [...getGamesQueryKey(filter), page, pageSize],
        () => getGames({ filter, page, pageSize }),
        {
            enabled: !!filter,
            keepPreviousData: true,
        },
    );

    return playerQuery;
};

export const getGamesCount = async ({ filter }: { filter: GameFilter }) => {
    const response = await client.dart.game.getGamesCount(filter);
    return response;
};

export const useGetGamesCount = (filter: GameFilter) => {
    return useQuery([...getGamesQueryKey(filter), 'count'], () => getGamesCount({ filter }));
};
