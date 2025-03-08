import { useQuery } from 'react-query';

import { getUser } from '@/repository/user';

export const useUser = () => useQuery(['user'], getUser, { keepPreviousData: true, staleTime: Infinity });
