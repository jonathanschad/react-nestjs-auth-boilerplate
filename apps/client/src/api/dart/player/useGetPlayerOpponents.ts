import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerOpponents = async (playerId: string) => {
    const response = await client.dart.player.getOpponents({ playerId });
    return response;
};

export const useGetPlayerOpponents = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'opponents'],
        queryFn: playerUuid ? () => getPlayerOpponents(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
