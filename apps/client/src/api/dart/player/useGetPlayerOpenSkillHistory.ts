import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerOpenSkillHistory = async (playerId: string) => {
    const response = await tsRestClient.dart.player.getOpenSkillHistory({
        params: { userId: playerId },
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch player OpenSkill history');
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
