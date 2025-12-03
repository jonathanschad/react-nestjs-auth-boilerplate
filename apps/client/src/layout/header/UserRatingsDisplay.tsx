import { Skeleton } from '@darts/ui/components/skeleton';
import { ordinal, rating } from 'openskill';
import { useGetPlayer } from '@/api/dart/player/useGetPlayer';
import { RatingDisplay } from '@/layout/header/RatingDisplay';
import { useUser } from '@/store/async-store';

export const UserRatingsDisplay = () => {
    const { data: user } = useUser();
    const { data: playerData, isLoading } = useGetPlayer(user?.id);

    if (!user || isLoading || !playerData) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        );
    }

    const { currentRating } = playerData;
    const openSkillRating = rating(currentRating.openSkill.rating);
    const openSkillScore = ordinal(openSkillRating);

    const eloRank = currentRating.elo.rank;
    const openSkillRank = currentRating.openSkill.rank;

    return (
        <div className="flex items-center gap-2">
            <RatingDisplay rating={currentRating.elo.rating.elo.toFixed(0)} rank={eloRank} type="elo" />
            <RatingDisplay rating={openSkillScore.toFixed(1)} rank={openSkillRank} type="openskill" />
        </div>
    );
};
