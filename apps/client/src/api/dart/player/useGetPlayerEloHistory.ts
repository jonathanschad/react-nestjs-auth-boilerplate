import { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerEloHistory = async (
    playerId: string,
): Promise<Api['dart']['player']['getEloHistory']['response']> => {
    try {
        const response = await api.get<Api['dart']['player']['getEloHistory']['response']>(
            `${BASE_URL}/dart/player/${playerId}/rating-history`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching player rating history:', error);
        throw error;
    }
};

export const useGetPlayerEloHistory = (playerUuid: string) => {
    const playerQuery = useQuery(
        [...getPlayerQueryKey(playerUuid), 'eloHistory'],
        () => getPlayerEloHistory(playerUuid),
        {
            enabled: !!playerUuid,
        },
    );

    return playerQuery;
};
