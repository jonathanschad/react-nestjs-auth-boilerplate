import { getUser } from '@client/repository/user';
import { useQuery } from 'react-query';

export const useUser = () => useQuery(['user'], getUser, { keepPreviousData: true, staleTime: Infinity });
