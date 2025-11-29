import { useQuery } from 'react-query';
import api from '@/api';
import { getPrivacyPolicyQueryKey } from '@/api/misc/misc.queryKey';

export const getDataPrivacyPolicy = async () => {
    const response = await api.get<string>('/legal/privacy-policy');

    return response.data;
};

export const useGetPrivacyPolicy = () => {
    return useQuery(getPrivacyPolicyQueryKey(), getDataPrivacyPolicy);
};
