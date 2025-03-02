import { useMutation } from 'react-query';

import { ProfilePictureEditor } from '@client/components/ProfilePictureEditor';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@client/layout/useSetSignedInCurrentActiveRoute';
import { logout } from '@client/repository/login';

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
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
            <ProfilePictureEditor />
        </>
    );
};
