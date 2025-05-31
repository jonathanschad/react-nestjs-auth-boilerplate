import { CircleUser } from 'lucide-react';

import { Avatar } from '@boilerplate/ui/components/avatar';

import { AuthenticatedImage } from '@/components/authenticated-image';
import { useUser } from '@/store/async-store';

interface ProfilePictureProps {
    size?: string | number;
}

export const ProfilePicture = ({ size }: ProfilePictureProps) => {
    const { data: user } = useUser();
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
