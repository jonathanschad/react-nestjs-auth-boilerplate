import { useQuery } from 'react-query';

import { getUser } from '@client/repository/user';

export const useUser = () => useQuery(['user'], getUser, { keepPreviousData: true, staleTime: Infinity });
