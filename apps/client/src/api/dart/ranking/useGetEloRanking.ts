import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getEloRankings = async () => {
    const response = await tsRestClient.dart.rankings.elo({
        query: {},
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch ELO rankings');
};

export const useGetEloRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'elo'], () => getEloRankings());

    return rankingQuery;
};
