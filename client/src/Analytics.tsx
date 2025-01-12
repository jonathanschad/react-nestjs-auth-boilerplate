import Plausible from 'plausible-tracker';
import { useEffect, useRef } from 'react';

import { config } from '@/config';

export const Analytics = () => {
    const plausible = useRef<ReturnType<typeof Plausible> | null>(null);
    useEffect(() => {
        plausible.current = Plausible({
            domain: config.PUBLIC_URL,
            apiHost: config.PLAUSIBLE_HOST_URL ?? undefined,
            trackLocalhost: true,
        });
        const cleanUp = plausible.current.enableAutoPageviews();

        return () => {
            cleanUp();
        };
    }, []);
    return null;
};
