import { LoginFormValues } from '@/forms/login-form';
import { RegisterFormValues } from '@/forms/register-form';
import api, { BASE_URL } from '@/repository';
import { useStore } from '@/store/store';

export const login = async ({ email, password, remember }: LoginFormValues) => {
    const data = await api.post(BASE_URL + '/auth/login', { email, password, remember }, { withCredentials: true });

    return data;
};

export const logout = async () => {
    const data = await api.post(BASE_URL + '/auth/logout');
    useStore.getState().setAccessToken(null);
    return data;
};

export const register = async (registerDTO: RegisterFormValues) => {
    const data = await api.post(BASE_URL + '/signup', registerDTO, {
        withCredentials: true,
    });

    return data;
};

export const confirmEmail = async ({ token }: { token?: string | null }) => {
    if (!token) return false;
    try {
        const data = await api.get<{ success: boolean }>(BASE_URL + `/signup/verify-email-token?token=${token}`);
        return data.data.success;
    } catch (error) {
        return false;
    }
};

export const resendVerificationEmail = async ({ email }: { email: string }) => {
    try {
        const data = await api.post<{ success: boolean }>(BASE_URL + `/signup/resend-verification`, { email });
        return data.data.success;
    } catch (error) {
        return false;
    }
};
