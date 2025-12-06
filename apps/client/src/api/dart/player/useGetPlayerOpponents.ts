import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerOpponents = async (playerId: string) => {
    const response = await tsRestClient.dart.player.getOpponents({
        params: { playerId },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch player opponents');
};

export const useGetPlayerOpponents = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'opponents'],
        queryFn: playerUuid ? () => getPlayerOpponents(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
