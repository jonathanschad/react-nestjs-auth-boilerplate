import { Button } from '@darts/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@darts/ui/components/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@darts/ui/components/sheet';
import { Translation } from '@darts/ui/i18n/Translation';
import clsx from 'clsx';
import { Hexagon, Menu } from 'lucide-react';
import * as React from 'react';
import { useMutation } from 'react-query';
import { Link, Outlet } from 'react-router-dom';

import { ProfilePicture } from '@/components/ProfilePicture';
import { ProjectLogo } from '@/components/ProjectLogo';
import { CurrentlySelectedRouteOptions } from '@/layout/useSetSignedInCurrentActiveRoute';
import { logout } from '@/repository/login';

export const SignedInLayout = () => {
    const [currentlySelectedRoute, setCurrentlySelectedRoute] = React.useState<CurrentlySelectedRouteOptions | null>(
        null,
    );

    const logoutMutation = useMutation({
        mutationFn: logout,
    });
    return (
        <div className="flex max-h-screen min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 flex-shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <ProjectLogo />
                    <Link
                        to="/"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.DASHBOARD
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>dashboard</Translation>
                    </Link>
                    <Link
                        to="/ranking"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.RANKING
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>ranking</Translation>
                    </Link>
                    <Link
                        to="/settings"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.SETTINGS
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>settings</Translation>
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                <Translation>toggleNavigationMenu</Translation>
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
                                <Hexagon className="h-6 w-6" />
                                <span className="sr-only">
                                    <Translation>projectName</Translation>
                                </span>
                            </Link>
                            <Link
                                to="/"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.DASHBOARD
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>dashboard</Translation>
                            </Link>
                            <Link
                                to="/ranking"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.RANKING
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>ranking</Translation>
                            </Link>
                            <Link
                                to="/settings"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.SETTINGS
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>settings</Translation>
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="ml-auto flex items-center justify-end gap-4 md:gap-2 lg:gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <ProfilePicture size={40} />
                                <span className="sr-only">
                                    <Translation>toggleUserMenu</Translation>
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <Translation>myAccount</Translation>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/settings" className="w-full">
                                    <Translation>settings</Translation>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>
                                <Translation>legal</Translation>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/imprint" className="w-full">
                                    <Translation>imprint</Translation>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="/privacy-policy" className="w-full">
                                    <Translation>privacyPolicyShort</Translation>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="/licenses" className="w-full">
                                    <Translation>licenses</Translation>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="w-full">
                                <Translation>logout</Translation>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <Outlet context={{ setCurrentlySelectedRoute }} />
            </main>
        </div>
    );
};
