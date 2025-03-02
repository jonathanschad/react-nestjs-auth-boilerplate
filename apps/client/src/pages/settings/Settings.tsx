import clsx from 'clsx';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { Translation } from '@client/i18n/Translation';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@client/layout/useSetSignedInCurrentActiveRoute';
import { CurrentSettingsRouteOptions } from '@client/pages/settings/useSetSettingsCurrentActiveRoute';

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
                        to="/settings/notification"
                        className={clsx(
                            currentlySelectedRoute === CurrentSettingsRouteOptions.NOTIFICATION &&
                                'font-semibold text-primary',
                        )}
                    >
                        <Translation>notifications</Translation>
                    </Link>
                </nav>
                <div className="grid gap-6">
                    <Outlet context={{ setCurrentlySelectedRoute }} />
                </div>
            </div>
        </>
    );
};
