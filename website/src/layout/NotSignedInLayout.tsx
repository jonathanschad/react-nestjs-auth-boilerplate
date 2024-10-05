import React, { ReactNode, useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

export const NotSignedInLayout = () => {
    const [illustration, setIllustration] = useState<React.ReactNode | null>(null);
    return (
        <div className="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <Outlet context={{ setIllustration }} />
                </div>
            </div>
            <div className="hidden max-w-full bg-muted lg:block">
                <div className="flex h-full items-center justify-center p-4">{illustration}</div>
            </div>
        </div>
    );
};

export const useSetNotSignedInLayoutIllustration = (illustration: ReactNode) => {
    const { setIllustration } = useOutletContext<{ setIllustration: (node: ReactNode) => void }>();
    useEffect(() => {
        setIllustration(illustration);
    }, [illustration]);
};
