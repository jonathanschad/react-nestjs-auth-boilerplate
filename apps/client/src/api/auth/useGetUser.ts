import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { tsRestClient } from '@/api/client';

export const getUser = async () => {
    const response = await tsRestClient.auth.getUser({
        query: {},
    });

    if (response.status === 200) {
        return response.body;
    }

    return null;
};

export const useGetUser = () => {
    const { i18n } = useTranslation();
    return useQuery(getUserQueryKey(), getUser, {
        onSuccess: (data) => {
            if (data?.settings.language) {
                void i18n.changeLanguage(data.settings.language);
            }
        },
    });
};
