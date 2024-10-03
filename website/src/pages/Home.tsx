import { useMutation } from 'react-query';

import FileUpload from '@/components/FileUpload';
import { ProfilePictureEditor } from '@/components/ProfilePictureEditor';
import { AuthenticatedImage } from '@/components/ui/authenticated-image';
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
        <div>
            Logged IN
            <button onClick={() => logoutMutatiuon.mutate()}>Logout</button>
            <ProfilePictureEditor />
        </div>
    );
};
