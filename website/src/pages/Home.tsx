import { useMutation } from 'react-query';

import { ProfilePictureEditor } from '@/components/ProfilePictureEditor';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { logout } from '@/repository/login';

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
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
            <ProfilePictureEditor />
        </>
    );
};
