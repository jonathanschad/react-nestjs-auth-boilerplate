import { useMutation } from 'react-query';
import { logout } from '@/api/auth/useLogout';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
// eslint-disable-next-line no-restricted-imports
import packageJson from '../../package.json';

export const Home = () => {
    const logoutMutatiuon = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            console.log(data);
            window.location.href = '/login';
        },
    });
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
            <button type="button" onClick={() => logoutMutatiuon.mutate()}>
                Logout
            </button>
        </>
    );
};
