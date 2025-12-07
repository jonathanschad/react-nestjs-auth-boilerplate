import { GameFilter } from '@darts/types';
import { getDartQueryKey } from '@/api/dart/dart.queryKey';

export const getGamesQueryKey = (filter: GameFilter) => [...getDartQueryKey(), 'games', JSON.stringify(filter)];
