import { Translation } from '@boilerplate/ui/i18n/Translation';
import type React from 'react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ProjectLogo } from '@/components/ProjectLogo';

export const NotSignedInLayout = () => {
    const [illustration, setIllustration] = useState<React.ReactNode | null>(null);
    return (
        <>
            <div className="h-full w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:overflow-auto xl:min-h-[800px]">
                <div className="flex h-full w-full flex-col overflow-y-auto">
                    <header className="flex h-16 flex-shrink-0 items-center gap-4 bg-background px-4 md:px-6">
                        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                            <ProjectLogo />
                        </nav>
                        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                            <div className="flex-1" />
                            <LanguageSwitcher />
                        </div>
                    </header>
                    <div className="flex h-full items-center justify-center overflow-auto">
                        <Outlet context={{ setIllustration }} />
                    </div>
                </div>
                <div className="hidden max-w-full bg-muted lg:block">
                    <div className="flex h-full items-center justify-center p-4">{illustration}</div>
                </div>
            </div>
            <footer className="flex flex-col items-center justify-center border-t bg-background sm:h-16 sm:flex-row">
                <p className="mx-4 my-2 flex-1 text-sm text-muted-foreground">
                    © {new Date().getFullYear()}{' '}
                    <span className="font-semibold">
                        <Translation>projectName</Translation>
                    </span>
                </p>
                <Link to="/login" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>login</Translation>
                </Link>
                <Link to="/imprint" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>imprint</Translation>
                </Link>
                <Link to="/privacy-policy" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>privacyPolicyShort</Translation>
                </Link>
                <Link to="/licenses" className="mx-4 my-2 text-sm text-muted-foreground">
                    <Translation>licenses</Translation>
                </Link>
            </footer>
        </>
    );
};
