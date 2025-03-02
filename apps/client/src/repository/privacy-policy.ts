import api from '@client/repository';

export const getDataPrivacyPolicy = async () => {
    const response = await api.get<string>('/legal/privacy-policy');

    return response.data;
};
