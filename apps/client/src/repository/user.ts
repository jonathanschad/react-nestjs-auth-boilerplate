import api, { BASE_URL } from '@/repository';
import { SanitizedUser } from '@/types/user';

export const getUser = async () => {
    try {
        const data = await api.get<SanitizedUser>(BASE_URL + `/user`);
        return data.data;
    } catch (error) {
        return null;
    }
};

export const updateUserName = async (name: string): Promise<SanitizedUser> => {
    const response = await api.patch<SanitizedUser>(BASE_URL + `/user/name`, { name });
    return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    const response = await api.patch<{ success: boolean }>(BASE_URL + `/user/password`, {
        currentPassword,
        newPassword,
    });
    return response.data;
};
