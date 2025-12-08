import { LoadingSpinner } from '@darts/ui/components/loading-spinner';
import { Translation } from '@darts/ui/i18n/Translation';
import clsx from 'clsx';
import { Suspense, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { CurrentSettingsRouteOptions } from '@/pages/settings/useSetSettingsCurrentActiveRoute';

export const Settings = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.SETTINGS);
    const [currentlySelectedRoute, setCurrentlySelectedRoute] = useState<CurrentSettingsRouteOptions | null>(null);
    return (
        <>
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <Translation as={'h2'}>settings</Translation>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav className="grid gap-4 text-sm text-muted-foreground">
                    <Link
                        to="/settings/profile"
                        className={clsx(
                            currentlySelectedRoute === CurrentSettingsRouteOptions.PROFILE &&
                                'font-semibold text-primary',
                        )}
                    >
                        <Translation>profile</Translation>
                    </Link>
                    <Link
                        to="/settings/language"
                        className={clsx(
                            currentlySelectedRoute === CurrentSettingsRouteOptions.LANGUAGE &&
                                'font-semibold text-primary',
                        )}
                    >
                        <Translation>language</Translation>
                    </Link>
                </nav>
                <div className="grid gap-6">
                    <Suspense
                        fallback={
                            <div className="flex h-full w-full items-center justify-center">
                                <LoadingSpinner />
                            </div>
                        }
                    >
                        <Outlet context={{ setCurrentlySelectedRoute }} />
                    </Suspense>
                </div>
            </div>
        </>
    );
};
