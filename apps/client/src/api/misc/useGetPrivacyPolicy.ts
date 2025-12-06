import { useQuery } from 'react-query';
import { client } from '@/api/client';
import { getPrivacyPolicyQueryKey } from '@/api/misc/misc.queryKey';

export const getDataPrivacyPolicy = async () => {
    const response = await client.misc.getPrivacyPolicy({});
    return response;
};

export const useGetPrivacyPolicy = () => {
    return useQuery(getPrivacyPolicyQueryKey(), getDataPrivacyPolicy);
};
