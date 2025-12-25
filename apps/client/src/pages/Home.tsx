import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
// eslint-disable-next-line no-restricted-imports
import packageJson from '../../package.json';

export const Home = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.DASHBOARD);

    return (
        <>
            Logged IN
            <button
                type="button"
                onClick={() => {
                    throw new Error('Sentry Test Error');
                }}
            >
                Break the world
            </button>
            <p>Version: {packageJson.version}</p>
        </>
    );
};
