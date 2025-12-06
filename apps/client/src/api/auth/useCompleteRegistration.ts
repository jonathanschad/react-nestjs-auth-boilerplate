import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';
import type { CompleteRegisterFormValues } from '@/forms/complete-register-form';

export const completeRegistration = async (completeRegisterDTO: CompleteRegisterFormValues) => {
    const response = await tsRestClient.auth.completeRegistration({
        body: completeRegisterDTO,
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to complete registration');
};

export const useCompleteRegistration = () => {
    return useMutation(completeRegistration);
};
