import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getOpenSkillRankings = async () => {
    const response = await tsRestClient.dart.rankings.openskill({
        query: {},
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch OpenSkill rankings');
};

export const useGetOpenSkillRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'openskill'], () => getOpenSkillRankings());

    return rankingQuery;
};
