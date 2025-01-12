import { config } from '@/config';
import api from '@/repository';
import { renewAccessToken } from '@/repository/auth';

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
