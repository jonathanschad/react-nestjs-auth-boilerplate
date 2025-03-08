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
