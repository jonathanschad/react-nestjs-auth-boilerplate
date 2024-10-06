import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { Translation } from '@/i18n/Translation';

export const NotSignedInLayout = () => {
    const [illustration, setIllustration] = useState<React.ReactNode | null>(null);
    return (
        <>
            <div className="w-full lg:grid lg:h-full lg:min-h-[600px] lg:grid-cols-2 lg:overflow-auto xl:min-h-[800px]">
                <div className="flex h-full items-center justify-center overflow-auto py-12">
                    <Outlet context={{ setIllustration }} />
                </div>
                <div className="hidden max-w-full bg-muted lg:block">
                    <div className="flex h-full items-center justify-center p-4">{illustration}</div>
                </div>
            </div>
            <footer className="flex flex-col items-center justify-center border-t bg-background sm:h-16 sm:flex-row">
                <p className="mx-4 my-2 flex-1 text-sm text-muted-foreground">
                    © {new Date().getFullYear()} <span className="font-semibold">Project Name</span>
                </p>
                <Link to="/imprint" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>imprint</Translation>
                </Link>
                <Link to="/terms" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>termsOfServiceShort</Translation>
                </Link>
                <Link to="/licenses" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>licenses</Translation>
                </Link>
            </footer>
        </>
    );
};
