import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getRankingQueryKey } from '@/api/dart/ranking/ranking.queryKey';

export const getEloRankings = async () => {
    const response = await client.dart.rankings.elo({});
    return response;
};

export const useGetEloRanking = () => {
    const rankingQuery = useQuery([...getRankingQueryKey(), 'elo'], () => getEloRankings());

    return rankingQuery;
};
