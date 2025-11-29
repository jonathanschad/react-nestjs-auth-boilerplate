import type { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getEloRankings = async (): Promise<Api['dart']['rankings']['elo']['response']> => {
    try {
        const response = await api.get<Api['dart']['rankings']['elo']['response']>(`${BASE_URL}/dart/ranking/elo`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ELO rankings:', error);
        throw error;
    }
};

export const useGetEloRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'elo'], () => getEloRankings());

    return rankingQuery;
};
