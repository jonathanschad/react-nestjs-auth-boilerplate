import { Avatar } from '@boilerplate/ui/components/avatar';
import { Skeleton } from '@boilerplate/ui/components/skeleton';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetPlayer } from '@/api/dart/player/useGetPlayer';
import { AuthenticatedImage } from '@/components/authenticated-image';

interface UserTableCellProps {
    userUuid: string;
    showName?: boolean;
    avatarSize?: 'sm' | 'md' | 'lg';
}

const avatarSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
};

export const UserTableCell = ({ userUuid, showName = true, avatarSize = 'md' }: UserTableCellProps) => {
    const { data: playerData, isLoading, isError } = useGetPlayer(userUuid);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className={`rounded-full ${avatarSizeClasses[avatarSize]}`} />
                {showName && <Skeleton className="h-4 w-24" />}
            </div>
        );
    }

    if (isError || !playerData) {
        return (
            <div className="flex items-center gap-2">
                <Avatar className={avatarSizeClasses[avatarSize]}>
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Avatar>
                {showName && <span className="text-muted-foreground">Unknown User</span>}
            </div>
        );
    }

    const player = playerData.player;
    const displayName = player.name || 'Unknown User';

    return (
        <Link to={`/player/${userUuid}`}>
            <div className="flex items-center gap-2">
                <Avatar className={avatarSizeClasses[avatarSize]}>
                    {player.profilePictureId ? (
                        <AuthenticatedImage
                            fileUuid={player.profilePictureId}
                            className="h-full w-full object-cover"
                            fallback={
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                            }
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                </Avatar>
                {showName && <span className="font-medium">{displayName}</span>}
            </div>
        </Link>
    );
};
