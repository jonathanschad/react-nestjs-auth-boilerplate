import { Checkbox } from '@radix-ui/react-checkbox';

import { Button } from '@client/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@client/components/ui/card';
import { Input } from '@client/components/ui/input';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@client/pages/settings/useSetSettingsCurrentActiveRoute';

export const NotificationSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.NOTIFICATION);

    return (
        <div>
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
    );
};
