import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerDetails = async (playerId: string) => {
    const response = await tsRestClient.dart.player.getDetails({
        params: { playerId },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch player details');
};

export const useGetPlayer = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'basicInfo'],
        queryFn: playerUuid ? () => getPlayerDetails(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
