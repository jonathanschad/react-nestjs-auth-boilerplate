import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerEloHistory = async (playerId: string) => {
    const response = await client.dart.player.getEloHistory({ userId: playerId });
    return response;
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
