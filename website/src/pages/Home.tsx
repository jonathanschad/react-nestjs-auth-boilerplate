import { useMutation } from 'react-query';

import FileUpload from '@/components/FileUpload';
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
            <AuthenticatedImage fileUuid="15adb1c6-e066-4bcd-bf39-2f0ec91bac79" />
            <FileUpload />
        </div>
    );
};
