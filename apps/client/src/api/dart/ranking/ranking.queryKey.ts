import { getDartQueryKey } from '@/api/dart/dart.queryKey';

export const getRankingQueryKey = () => [...getDartQueryKey(), 'ranking'];
