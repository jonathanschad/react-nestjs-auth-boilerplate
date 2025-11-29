import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';

export const completeGoogleAccountConnection = async (completeRegisterDTO: { password: string; token: string }) => {
    const data = await api.post(`${BASE_URL}/auth/google/complete-account-connection`, completeRegisterDTO, {
        withCredentials: true,
    });

    return data;
};

export const useCompleteGoogleAccountConnection = () => {
    return useMutation(completeGoogleAccountConnection);
};
