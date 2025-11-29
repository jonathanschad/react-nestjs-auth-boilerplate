import type { Api } from '@darts/types/api/api';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getOpenSkillRankings = async (): Promise<Api['dart']['rankings']['openskill']['response']> => {
    try {
        const response = await api.get<Api['dart']['rankings']['openskill']['response']>(
            `${BASE_URL}/dart/ranking/openskill`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching OpenSkill rankings:', error);
        throw error;
    }
};

export const useGetOpenSkillRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'openskill'], () => getOpenSkillRankings());

    return rankingQuery;
};
