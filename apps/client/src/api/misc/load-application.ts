import api from '@/api';
import { renewAccessToken } from '@/api/auth/access-token';
import { config } from '@/config';

export const loadApplication = async () => {
    await Promise.allSettled([renewAccessToken(), loadEnv()]);
};

const loadEnv = async () => {
    const envResponse = await api.get<Partial<ImportMetaEnv>>('/envs');
    Object.assign(config, envResponse.data);

    console.log('Loaded environment variables', config);

    if (Object.values(config).some((value) => value === undefined)) {
        throw new Error('Failed to load environment variables');
    }
};
