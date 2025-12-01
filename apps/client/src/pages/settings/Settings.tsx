import { Translation } from '@darts/ui/i18n/Translation';
import clsx from 'clsx';
import { useState } from 'react';
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
                        to="/settings/general"
                        className={clsx(
                            currentlySelectedRoute === CurrentSettingsRouteOptions.GENERAL &&
                                'font-semibold text-primary',
                        )}
                    >
                        <Translation>general</Translation>
                    </Link>
                </nav>
                <div className="grid gap-6">
                    <Outlet context={{ setCurrentlySelectedRoute }} />
                </div>
            </div>
        </>
    );
};
