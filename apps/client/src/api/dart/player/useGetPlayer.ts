import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerDetails = async (playerId: string) => {
    const response = await client.dart.player.getDetails({ playerId });
    return response;
};

export const useGetPlayer = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'basicInfo'],
        queryFn: playerUuid ? () => getPlayerDetails(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
