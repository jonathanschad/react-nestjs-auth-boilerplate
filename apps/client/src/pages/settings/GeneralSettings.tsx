import { Button } from '@boilerplate/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@boilerplate/ui/components/card';
import { Input } from '@boilerplate/ui/components/input';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@/pages/settings/useSetSettingsCurrentActiveRoute';

export const GeneralSettings = () => {
    useSetSettingsCurrentActiveRoute(CurrentSettingsRouteOptions.GENERAL);

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
        </div>
    );
};
