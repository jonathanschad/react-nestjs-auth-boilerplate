import api from '@/repository';

export const getDataPrivacyPolicy = async () => {
    const response = await api.get<string>('/legal/privacy-policy');

    return response.data;
};
