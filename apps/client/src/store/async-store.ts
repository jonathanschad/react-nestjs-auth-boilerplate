import { useQuery } from 'react-query';

import { getUser } from '@/api/auth/useGetUser';

export const useUser = () => useQuery(['user'], getUser, { keepPreviousData: true, staleTime: Infinity });
