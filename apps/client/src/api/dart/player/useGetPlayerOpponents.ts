import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerOpponentsWithHeadToHead = async (playerId: string) => {
    const response = await client.dart.player.getOpponentsWithHeadToHead({ playerId });
    return response;
};

export const useGetPlayerOpponentsWithHeadToHead = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'opponentsWithHeadToHead'],
        queryFn: playerUuid ? () => getPlayerOpponentsWithHeadToHead(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
