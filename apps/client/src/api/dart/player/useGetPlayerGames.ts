import { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerGames = async (playerId: string): Promise<Api['dart']['player']['getGames']['response']> => {
    try {
        const response = await api.get<Api['dart']['player']['getGames']['response']>(
            `${BASE_URL}/dart/player/${playerId}/games`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching player games:', error);
        throw error;
    }
};

export const useGetPlayerGames = (playerUuid: string) => {
    const playerQuery = useQuery([...getPlayerQueryKey(playerUuid), 'games'], () => getPlayerGames(playerUuid), {
        enabled: !!playerUuid,
    });

    return playerQuery;
};
