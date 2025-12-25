import { Translation } from '@boilerplate/ui/i18n/Translation';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { loadApplication } from '@/api/misc/load-application';
import { Loading } from '@/components/Loading';

const LoadingApplication = ({ children }: { children: React.ReactNode }) => {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const hasMutated = useRef(false);
    const { mutate } = useMutation({
        mutationFn: loadApplication,
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
        <Loading isLoading={true} loadingMessage={<Translation as={'h2'}>loadingApplication</Translation>}>
            {children}
        </Loading>
    );
};

export default LoadingApplication;
