import { type ReactNode, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export const useSetNotSignedInLayoutIllustration = (illustration: ReactNode) => {
    const { setIllustration } = useOutletContext<{ setIllustration: (node: ReactNode) => void }>();
    useEffect(() => {
        setIllustration(illustration);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [illustration]);
};
