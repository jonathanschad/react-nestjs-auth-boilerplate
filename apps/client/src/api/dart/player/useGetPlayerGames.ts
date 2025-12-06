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
    const response = await client.dart.player.getGames({ playerId, page, pageSize });
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
