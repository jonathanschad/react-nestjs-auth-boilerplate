import { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getPlayerQueryKey } from '@/api/dart/player/player.queryKey';

const getPlayerDetails = async (playerId: string): Promise<Api['dart']['player']['getDetails']['response']> => {
    try {
        const response = await api.get<Api['dart']['player']['getDetails']['response']>(
            `${BASE_URL}/dart/player/${playerId}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching player details:', error);
        throw error;
    }
};

export const useGetPlayer = (playerUuid: string | undefined) => {
    return useQuery({
        queryKey: [...getPlayerQueryKey(playerUuid ?? 'disabled'), 'basicInfo'],
        queryFn: playerUuid ? () => getPlayerDetails(playerUuid) : undefined,
        enabled: !!playerUuid,
    });
};
