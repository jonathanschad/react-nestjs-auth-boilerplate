import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getOpenSkillRankings = async () => {
    const response = await client.dart.rankings.openskill({});
    return response;
};

export const useGetOpenSkillRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'openskill'], () => getOpenSkillRankings());

    return rankingQuery;
};
