import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerAverageHistory = async (playerId: string) => {
    const response = await client.dart.player.getAverageHistory({ userId: playerId });
    return response;
};

export const useGetPlayerAverageHistory = (playerUuid: string) => {
    const playerQuery = useQuery(
        [...getPlayerQueryKey(playerUuid), 'averageHistory'],
        () => getPlayerAverageHistory(playerUuid),
        {
            enabled: !!playerUuid,
        },
    );

    return playerQuery;
};
