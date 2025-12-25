import { Button } from '@boilerplate/ui/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@boilerplate/ui/components/dropdown-menu';
import { LoadingSpinner } from '@boilerplate/ui/components/loading-spinner';
import { Sheet, SheetContent, SheetTrigger } from '@boilerplate/ui/components/sheet';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import clsx from 'clsx';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { Suspense } from 'react';
import { useMutation } from 'react-query';
import { Link, Outlet } from 'react-router-dom';
import { logout } from '@/api/auth/useLogout';
import { ProfilePicture } from '@/components/ProfilePicture';
import { ProjectLogo } from '@/components/ProjectLogo';
import { CurrentlySelectedRouteOptions } from '@/layout/useSetSignedInCurrentActiveRoute';

export const SignedInLayout = () => {
    const [currentlySelectedRoute, setCurrentlySelectedRoute] = React.useState<CurrentlySelectedRouteOptions | null>(
        null,
    );

    const logoutMutation = useMutation({
        mutationFn: logout,
    });
    return (
        <div className="flex max-h-screen min-h-screen w-screen flex-col">
            <header className="sticky top-0 flex h-16 flex-shrink-0 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <ProjectLogo />
                    <Link
                        to="/ranking/elo"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.ELO_RANKING
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>eloRating</Translation>
                    </Link>
                    <Link
                        to="/ranking/openskill"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.OPENSKILL_RANKING
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>openSkillRating</Translation>
                    </Link>
                    <Link
                        to="/games"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.GAMES
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>allGames</Translation>
                    </Link>
                    <Link
                        to="/player-of-the-week"
                        className={clsx(
                            currentlySelectedRoute === CurrentlySelectedRouteOptions.PLAYER_OF_THE_WEEK
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            'transition-colors hover:text-foreground',
                        )}
                    >
                        <Translation>playerOfTheWeek</Translation>
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
                                <ProjectLogo />
                            </Link>
                            <Link
                                to="/ranking/elo"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.ELO_RANKING
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>eloRating</Translation>
                            </Link>
                            <Link
                                to="/ranking/openskill"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.OPENSKILL_RANKING
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>openSkillRating</Translation>
                            </Link>
                            <Link
                                to="/games"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.GAMES
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>allGames</Translation>
                            </Link>
                            <Link
                                to="/player-of-the-week"
                                className={clsx(
                                    currentlySelectedRoute === CurrentlySelectedRouteOptions.PLAYER_OF_THE_WEEK
                                        ? 'text-foreground'
                                        : 'text-muted-foreground',
                                    'hover:text-foreground',
                                )}
                            >
                                <Translation>playerOfTheWeek</Translation>
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
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10 overflow-auto [scrollbar-gutter:stable]">
                <Suspense
                    fallback={
                        <div className="flex h-full w-full items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <Outlet context={{ setCurrentlySelectedRoute }} />
                </Suspense>
            </main>
        </div>
    );
};
