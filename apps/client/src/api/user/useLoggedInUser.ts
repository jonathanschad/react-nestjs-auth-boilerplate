import { useQuery } from 'react-query';

import { getUser } from '@/api/auth/useGetUser';
import { getLoggedInUserQueryKey } from '@/api/user/user.queryKey';

export const useLoggedInUser = () => useQuery(getLoggedInUserQueryKey(), getUser);
