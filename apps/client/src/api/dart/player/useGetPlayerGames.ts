import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerGames = async ({
    playerId,
    page = 1,
    pageSize = 10,
}: {
    playerId: string;
    page?: number;
    pageSize?: number;
}) => {
    const response = await client.dart.game.getGames({ playerIds: [playerId], page, pageSize });
    return response;
};

export const useGetPlayerGames = (playerId: string, page: number = 1, pageSize: number = 10) => {
    const playerQuery = useQuery(
        [...getPlayerQueryKey(playerId), 'games', page, pageSize],
        () => getPlayerGames({ playerId, page, pageSize }),
        {
            enabled: !!playerId,
            keepPreviousData: true,
        },
    );

    return playerQuery;
};

export const getPlayerGamesCount = async ({ playerId }: { playerId: string }) => {
    const response = await client.dart.game.getGamesCount({ playerIds: [playerId] });
    return response;
};

export const useGetPlayerGamesCount = (playerId: string) => {
    return useQuery([...getPlayerQueryKey(playerId), 'games', 'count'], () => getPlayerGamesCount({ playerId }));
};
