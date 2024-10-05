import clsx from 'clsx';
import { Hexagon, Menu } from 'lucide-react';
import * as React from 'react';
import { useMutation } from 'react-query';
import { Link, Outlet } from 'react-router-dom';

import { ProfilePicture } from '@/components/ProfilePicture';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Translation } from '@/i18n/Translation';
import { logout } from '@/repository/login';

export enum CurrentlySelectedRouteOptions {
    DASHBOARD = 'dashboard',
    SETTINGS = 'settings',
}

interface SignedInLayoutProps {
    currentlySelectedRoute?: CurrentlySelectedRouteOptions;
}
export const SignedInLayout = ({ currentlySelectedRoute }: SignedInLayoutProps) => {
    const logoutMutation = useMutation({
        mutationFn: logout,
    });
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link to="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
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
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>dashboard</Translation>
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
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="flex-1" />
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
                                <Link to="/terms" className="w-full">
                                    <Translation>termsOfServiceShort</Translation>
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
                <Outlet />
            </main>
        </div>
    );
};
