import { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

export const getPlayerOpenSkillHistory = async (
    playerId: string,
): Promise<Api['dart']['player']['getOpenSkillHistory']['response']> => {
    try {
        const response = await api.get<Api['dart']['player']['getOpenSkillHistory']['response']>(
            `${BASE_URL}/dart/player/${playerId}/open-skill-history`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching player rating history:', error);
        throw error;
    }
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
