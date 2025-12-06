import { useQuery } from 'react-query';
import { tsRestClient } from '@/api/client';
import { getPrivacyPolicyQueryKey } from '@/api/misc/misc.queryKey';

export const getDataPrivacyPolicy = async () => {
    const response = await tsRestClient.misc.getPrivacyPolicy({
        query: {},
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to fetch privacy policy');
};

export const useGetPrivacyPolicy = () => {
    return useQuery(getPrivacyPolicyQueryKey(), getDataPrivacyPolicy);
};
