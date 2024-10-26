import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Translation } from '@/i18n/Translation';
import { renewAccessToken } from '@/repository/auth';

const LoadingApplication = ({ children }: { children: React.ReactNode }) => {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const hasMutated = useRef(false);
    const { mutate } = useMutation({
        mutationFn: renewAccessToken,
        onSettled: () => {
            setLoadingComplete(true);
        },
    });
    useEffect(() => {
        if (hasMutated.current) return;

        hasMutated.current = true;
        mutate();
    }, [hasMutated, mutate]);

    if (loadingComplete) return children;
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <LoadingSpinner size={64} />
            <Translation as={'h2'}>loadingApplication</Translation>
        </div>
    );
};

export default LoadingApplication;
