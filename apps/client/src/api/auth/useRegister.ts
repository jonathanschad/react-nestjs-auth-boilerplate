import { useMutation } from 'react-query';
import api, { BASE_URL } from '@/api';
import type { RegisterFormValues } from '@/forms/register-form';

export const register = async (registerDTO: RegisterFormValues) => {
    const data = await api.post(`${BASE_URL}/signup`, registerDTO, {
        withCredentials: true,
    });

    return data;
};

export const useRegister = () => {
    return useMutation(register);
};
