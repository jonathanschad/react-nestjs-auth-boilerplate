import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';
import type { CompleteRegisterFormValues } from '@/forms/complete-register-form';

export const completeRegistration = async (completeRegisterDTO: CompleteRegisterFormValues) => {
    const data = await api.post(`${BASE_URL}/signup/complete`, completeRegisterDTO, {
        withCredentials: true,
    });

    return data;
};

export const useCompleteRegistration = () => {
    return useMutation(completeRegistration);
};
