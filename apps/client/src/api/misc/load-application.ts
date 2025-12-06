import { client, renewAccessToken } from '@/api/client';
import { config } from '@/config';

export const loadApplication = async () => {
    await Promise.allSettled([renewAccessToken(), loadEnv()]);
};

const loadEnv = async () => {
    const response = await client.misc.getFrontendEnvs({});

    Object.assign(config, response);

    console.log('Loaded environment variables', config);

    if (Object.values(config).some((value) => value === undefined)) {
        throw new Error('Failed to load environment variables');
    }
};
