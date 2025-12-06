import { useMutation } from 'react-query';
import { tsRestClient } from '@/api/client';

export const completeGoogleAccountConnection = async (params: { token: string; password: string }) => {
    const response = await tsRestClient.auth.completeGoogleAccountConnection({
        body: params,
    });

    if (response.status === 200) {
        return response.body;
    }

    throw new Error('Failed to complete Google account connection');
};

export const useCompleteGoogleAccountConnection = () => {
    return useMutation(completeGoogleAccountConnection);
};
