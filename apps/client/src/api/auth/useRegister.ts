import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';
import type { RegisterFormValues } from '@/forms/register-form';

export const register = async (registerDTO: RegisterFormValues) => {
    const response = await tsRestClient.auth.register({
        body: registerDTO,
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Registration failed');
};

export const useRegister = () => {
    return useMutation(register);
};
