import { useMutation } from 'react-query';
import { client } from '@/api/client';
import type { RegisterFormValues } from '@/forms/register-form';

export const register = async (registerDTO: RegisterFormValues) => {
    const response = await client.signup.register(registerDTO);
    return response;
};

export const useRegister = () => {
    return useMutation(register);
};
