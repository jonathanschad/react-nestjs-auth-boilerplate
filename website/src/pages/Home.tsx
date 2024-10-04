import { useMutation } from 'react-query';

import { ProfilePictureEditor } from '@/components/ProfilePictureEditor';
import { SignedInLayout } from '@/layout/SignedInLayout';
import { logout } from '@/repository/login';

export const Home = () => {
    const logoutMutatiuon = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            console.log(data);
            window.location.href = '/login';
        },
    });
    return (
        <SignedInLayout>
            Logged IN
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
            <ProfilePictureEditor />
        </SignedInLayout>
    );
};
