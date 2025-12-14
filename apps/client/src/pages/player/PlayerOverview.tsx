import { Avatar } from '@darts/ui/components/avatar';
import { Button } from '@darts/ui/components/button';
import { Card } from '@darts/ui/components/card';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import { ArrowLeft, User } from 'lucide-react';
import { ordinal, rating } from 'openskill';
import { useNavigate } from 'react-router-dom';
import { useGetPlayer } from '@/api/dart/player/useGetPlayer';
import { useGetPlayerAverageHistory } from '@/api/dart/player/useGetPlayerAverageHistory';
import { AuthenticatedImage } from '@/components/authenticated-image';

type PlayerOverviewProps = {
    playerId: string;
};

const CardSkeleton = () => {
    return (
        <Card className="p-4">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
        </Card>
    );
};

export const PlayerOverviewSkeleton = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};

export const PlayerOverview = ({ playerId }: PlayerOverviewProps) => {
    const { data, isLoading, error } = useGetPlayer(playerId);
    const { data: averageHistory, isLoading: isLoadingAverageHistory } = useGetPlayerAverageHistory(playerId);
    const navigate = useNavigate();

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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-20 w-20">
                    {player.profilePictureId ? (
                        <AuthenticatedImage
                            fileUuid={player.profilePictureId}
                            className="h-full w-full object-cover"
                            fallback={
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <User className="h-10 w-10 text-muted-foreground" />
                                </div>
                            }
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                    )}
                </Avatar>
                <div>
                    <Typography as="h1">{player.name}</Typography>
                    <Typography as="mutedText">
                        <Translation>playerProfile</Translation>
                    </Typography>
                </div>
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
                        <Translation>playerOfTheWeekWins</Translation>
                    </Typography>
                    <Typography as="h2" className="mt-2">
                        {stats.playerOfTheWeekWins} 🏆
                    </Typography>
                </Card>
                {isLoadingAverageHistory && (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                )}
                {averageHistory && (
                    <>
                        <Card className="p-4">
                            <Typography as="smallText" className="text-muted-foreground">
                                <Translation>averageScoreCurrentMonth</Translation>
                            </Typography>
                            <Typography as="h2" className="mt-2">
                                {averageHistory.currentMonth.average.toFixed(2)}
                            </Typography>
                        </Card>
                        <Card className="p-4">
                            <Typography as="smallText" className="text-muted-foreground">
                                <Translation>scoringAverageCurrentMonth</Translation>
                            </Typography>
                            <Typography as="h2" className="mt-2">
                                {averageHistory.currentMonth.scoringAverage.toFixed(2)}
                            </Typography>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
};
