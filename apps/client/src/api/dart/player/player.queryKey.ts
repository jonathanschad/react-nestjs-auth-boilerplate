import { getDartQueryKey } from '@/api/dart/dart.queryKey';

export const getPlayerQueryKey = (playerUuid: string) => [...getDartQueryKey(), 'player', playerUuid];
