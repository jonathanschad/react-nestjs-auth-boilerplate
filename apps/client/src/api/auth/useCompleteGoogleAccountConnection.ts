import { useMutation } from 'react-query';
import { client } from '@/api/client';

export const completeGoogleAccountConnection = async (params: { token: string; password: string }) => {
    const response = await client.auth.google.completeGoogleAccountConnection(params);
    return response;
};

export const useCompleteGoogleAccountConnection = () => {
    return useMutation(completeGoogleAccountConnection);
};
