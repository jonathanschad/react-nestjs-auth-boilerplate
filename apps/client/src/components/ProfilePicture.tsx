import { Avatar } from '@boilerplate/ui/components/avatar';
import { CircleUser } from 'lucide-react';
import { useLoggedInUser } from '@/api/user/useLoggedInUser';
import { AuthenticatedImage } from '@/components/authenticated-image';

interface ProfilePictureProps {
    size?: string | number;
}

export const ProfilePicture = ({ size }: ProfilePictureProps) => {
    const { data: user } = useLoggedInUser();
    return (
        <Avatar
            style={{
                height: size,
                width: size,
            }}
            className="items-center justify-center"
        >
            <AuthenticatedImage
                key={user?.profilePictureId}
                fileUuid={user?.profilePictureId}
                className={'aspect-square h-full w-full'}
                fallback={
                    <CircleUser
                        style={{
                            height: '75%',
                            width: '75%',
                        }}
                    />
                }
            />
        </Avatar>
    );
};
