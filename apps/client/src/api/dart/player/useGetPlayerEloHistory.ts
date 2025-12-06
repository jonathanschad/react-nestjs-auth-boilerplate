import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerEloHistory = async (playerId: string) => {
    const response = await tsRestClient.dart.player.getEloHistory({
        params: { userId: playerId },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch player ELO history');
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
