import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Translation } from '@/i18n/Translation';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';

export const Settings = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.SETTINGS);
    return (
        <>
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>settings</Translation>
                </h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
                    <Link to="#" className="font-semibold text-primary">
                        General
                    </Link>
                    <Link to="#">Security</Link>
                    <Link to="#">Notifications</Link>
                    <Link to="#">Support</Link>
                    <Link to="#">Organizations</Link>
                    <Link to="#">Advanced</Link>
                </nav>
                <div className="grid gap-6">
                    <Card x-chunk="dashboard-04-chunk-1">
                        <CardHeader>
                            <CardTitle>Store Name</CardTitle>
                            <CardDescription>Used to identify your store in the marketplace.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <Input placeholder="Store Name" />
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save</Button>
                        </CardFooter>
                    </Card>
                    <Card x-chunk="dashboard-04-chunk-2">
                        <CardHeader>
                            <CardTitle>Plugins Directory</CardTitle>
                            <CardDescription>
                                The directory within your project, in which your plugins are located.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="flex flex-col gap-4">
                                <Input placeholder="Project Name" defaultValue="/content/plugins" />
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="include" defaultChecked onCheckedChange={() => {}} />
                                    <label
                                        htmlFor="include"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Allow administrators to change the directory.
                                    </label>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
};
