import { Translation } from '@darts/ui/i18n/Translation';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';

export const Ranking = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.RANKING);

    return (
        <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">
                <Translation>ranking</Translation>
            </h1>
            <div className="mt-4">
                {/* Ranking content will go here */}
                <p>Ranking page content</p>
            </div>
        </div>
    );
};
