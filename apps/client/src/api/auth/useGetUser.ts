import type { SanitizedUserWithSettings } from '@darts/types/entities/user';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import api, { BASE_URL } from '@/api';
import { getUserQueryKey } from '@/api/auth/auth.queryKey';

export const getUser = async () => {
    try {
        const data = await api.get<SanitizedUserWithSettings>(`${BASE_URL}/user`);
        return data.data;
    } catch (_error) {
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
