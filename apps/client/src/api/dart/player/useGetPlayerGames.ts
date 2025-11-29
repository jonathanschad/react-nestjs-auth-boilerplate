import { Api, PaginatedRequest } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

type GetPlayerGamesParams = PaginatedRequest<{
    playerId: string;
}>;

export const getPlayerGames = async ({
    playerId,
    page = 1,
    pageSize = 10,
}: GetPlayerGamesParams): Promise<Api['dart']['player']['getGames']['response']> => {
    try {
        const response = await api.get<Api['dart']['player']['getGames']['response']>(
            `${BASE_URL}/dart/player/${playerId}/games`,
            {
                params: { page, pageSize },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching player games:', error);
        throw error;
    }
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
