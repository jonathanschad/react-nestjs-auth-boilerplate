import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';
import { client } from '@/api/client';

export const getUser = async () => {
    try {
        const response = await client.user.getUser({});
        return response;
    } catch (error) {
        console.error('Failed to get user:', error);
        return null;
    }
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
