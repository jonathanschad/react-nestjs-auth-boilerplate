import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
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
    const response = await tsRestClient.dart.player.getGames({
        params: { playerId },
        query: { page, pageSize },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch player games');
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
