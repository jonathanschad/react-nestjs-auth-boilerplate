import { useMutation } from 'react-query';
import { ProfilePictureEditor } from '@/components/ProfilePictureEditor';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { logout } from '@/repository/login';
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
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
            <ProfilePictureEditor />
        </>
    );
};
