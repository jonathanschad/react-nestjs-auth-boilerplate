import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerOpenSkillHistory = async (playerId: string) => {
    const response = await client.dart.player.getOpenSkillHistory({ userId: playerId });
    return response;
};

export const useGetPlayerOpenSkillHistory = (playerUuid: string) => {
    const playerQuery = useQuery(
        [...getPlayerQueryKey(playerUuid), 'openSkillHistory'],
        () => getPlayerOpenSkillHistory(playerUuid),
        {
            enabled: !!playerUuid,
        },
    );

    return playerQuery;
};
