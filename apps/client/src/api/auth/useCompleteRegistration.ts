import { useMutation } from 'react-query';
import { client } from '@/api/client';
import type { CompleteRegisterFormValues } from '@/forms/complete-register-form';

export const completeRegistration = async (completeRegisterDTO: CompleteRegisterFormValues) => {
    const response = await client.signup.completeRegistration(completeRegisterDTO);
    return response;
};

export const useCompleteRegistration = () => {
    return useMutation(completeRegistration);
};
