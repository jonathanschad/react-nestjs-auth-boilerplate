import { useMutation, useQueryClient } from 'react-query';
import { client } from '@/api/client';
import type { LoginFormValues } from '@/forms/login-form';
import { useNavigate } from 'react-router-dom';

export const login = async ({ email, password, remember }: LoginFormValues) => {
    const response = await client.auth.login({ email, password, remember });
    return response;
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: login,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            navigate('/');
        },
    });
};
