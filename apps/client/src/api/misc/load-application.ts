import { tsRestClient } from '@/api/client';
import { config } from '@/config';

export const loadApplication = async () => {
    await Promise.allSettled([loadEnv()]);
};

const loadEnv = async () => {
    const response = await tsRestClient.misc.getFrontendEnvs({
        query: {},
    });

    if (response.status === 200) {
        Object.assign(config, response.body);

        console.log('Loaded environment variables', config);

        if (Object.values(config).some((value) => value === undefined)) {
            throw new Error('Failed to load environment variables');
        }
    } else {
        throw new Error('Failed to load environment variables');
    }
};
