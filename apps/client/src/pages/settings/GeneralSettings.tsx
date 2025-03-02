import { Button } from '@client/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@client/components/ui/card';
import { Input } from '@client/components/ui/input';
import {
    CurrentSettingsRouteOptions,
    useSetSettingsCurrentActiveRoute,
} from '@client/pages/settings/useSetSettingsCurrentActiveRoute';

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
