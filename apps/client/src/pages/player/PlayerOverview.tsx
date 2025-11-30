import { Card } from '@darts/ui/components/card';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import dayjs from 'dayjs';
import { ordinal, rating } from 'openskill';
import { useGetPlayer } from '@/api/dart/player/useGetPlayer';

type PlayerOverviewProps = {
    playerId: string;
};

export const PlayerOverviewSkeleton = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4">
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </Card>
            ))}
        </div>
    );
};

export const PlayerOverview = ({ playerId }: PlayerOverviewProps) => {
    const { data, isLoading, error } = useGetPlayer(playerId);

    if (isLoading) {
        return <PlayerOverviewSkeleton />;
    }

    if (error || !data) {
        return (
            <Card className="p-4">
                <Typography as="p">Error loading player stats.</Typography>
            </Card>
        );
    }

    const { player, currentRating, stats } = data;
    const openSkillRating = rating(currentRating.openSkill.rating);
    return (
        <>
            <div>
                <Typography as="h1">{player.name}</Typography>
                <Typography as="mutedText">
                    <Translation>playerProfile</Translation>
                </Typography>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>eloRating</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {currentRating.elo.rating.elo.toFixed(1)}
                    </Typography>
                </Card>
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>openSkillRating</Translation>
                    </Typography>
                    <Typography
                        as="h2"
                        className="mt-2"
                        title={`μ: ${currentRating.openSkill.rating.mu.toFixed(2)}, σ: ${currentRating.openSkill.rating.sigma.toFixed(2)}`}
                    >
                        {ordinal(openSkillRating).toFixed(2)}
                    </Typography>
                </Card>
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>gamesPlayed</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {stats.gamesPlayed}
                    </Typography>
                </Card>
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>winRate</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {(stats.winRate * 100).toFixed(1)}%
                    </Typography>
                </Card>
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>record</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {stats.wins}W - {stats.losses}L
                    </Typography>
                </Card>
                <Card className="p-4">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>lastGamePlayedAt</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {stats.lastGamePlayedAt ? dayjs(stats.lastGamePlayedAt).format('DD.MM.YYYY HH:mm') : '-'}
                    </Typography>
                </Card>
            </div>
        </>
    );
};
