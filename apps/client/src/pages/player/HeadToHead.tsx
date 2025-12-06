import type { GameEntityApiDTO } from '@darts/types';
import { Card } from '@darts/ui/components/card';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@darts/ui/components/table';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import { useMemo } from 'react';
import { useGetPlayerGames } from '@/api/dart/player/useGetPlayerGames';
import { useGetPlayerOpponents } from '@/api/dart/player/useGetPlayerOpponents';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

type HeadToHeadProps = {
    playerId: string;
};

type HeadToHeadStats = {
    opponentId: string;
    wins: number;
    losses: number;
    totalGames: number;
    winRate: number;
};

const calculateHeadToHeadStats = (playerId: string, opponentId: string, games: GameEntityApiDTO[]): HeadToHeadStats => {
    // Filter games where both players are involved
    const headToHeadGames = games.filter(
        (game) =>
            (game.playerA.id === playerId && game.playerB.id === opponentId) ||
            (game.playerA.id === opponentId && game.playerB.id === playerId),
    );

    const wins = headToHeadGames.filter((game) => game.winnerId === playerId).length;
    const losses = headToHeadGames.length - wins;
    const totalGames = headToHeadGames.length;
    const winRate = totalGames > 0 ? wins / totalGames : 0;

    return {
        opponentId,
        wins,
        losses,
        totalGames,
        winRate,
    };
};

type OpponentRowProps = {
    stats: HeadToHeadStats;
};

const OpponentRow = ({ stats }: OpponentRowProps) => {
    return (
        <TableRow>
            <TableCell>
                <UserTableCell userUuid={stats.opponentId} showName={true} avatarSize="sm" />
            </TableCell>
            <TableCell>
                <Typography as="normalText">{stats.totalGames}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">
                    {stats.wins}W - {stats.losses}L
                </Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">{(stats.winRate * 100).toFixed(1)}%</Typography>
            </TableCell>
        </TableRow>
    );
};

export const HeadToHeadSkeleton = () => {
    return (
        <Card className="p-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </Card>
    );
};

export const HeadToHead = ({ playerId }: HeadToHeadProps) => {
    const { data: opponents, isLoading: opponentsLoading, error: opponentsError } = useGetPlayerOpponents(playerId);

    // Fetch all games for the player (using a large page size to get all games)
    const { data: gamesData, isLoading: gamesLoading, error: gamesError } = useGetPlayerGames(playerId, 1, 1000);

    const headToHeadStats = useMemo(() => {
        if (!opponents || !gamesData?.data) return [];

        return opponents
            .map((opponent) => calculateHeadToHeadStats(playerId, opponent.opponentId, gamesData.data))
            .filter((stats) => stats.totalGames > 0)
            .sort((a, b) => b.totalGames - a.totalGames); // Sort by most games played
    }, [opponents, gamesData?.data, playerId]);

    if (opponentsLoading || gamesLoading) {
        return <HeadToHeadSkeleton />;
    }

    if (opponentsError || gamesError || !opponents || !gamesData) {
        return (
            <Card className="p-4">
                <Typography as="p">
                    <Translation>errorLoadingHeadToHead</Translation>
                </Typography>
            </Card>
        );
    }

    if (headToHeadStats.length === 0) {
        return (
            <Card className="p-4">
                <Typography as="h2" className="mb-4">
                    <Translation>headToHead</Translation>
                </Typography>
                <div className="flex h-32 items-center justify-center">
                    <Typography as="mutedText">
                        <Translation>noOpponentsYet</Translation>
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col p-4">
            <Typography as="h2" className="mb-4">
                <Translation>headToHead</Translation>
            </Typography>

            <div className="overflow-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Translation>opponent</Translation>
                            </TableHead>
                            <TableHead>
                                <Translation>gamesPlayed</Translation>
                            </TableHead>
                            <TableHead>
                                <Translation>record</Translation>
                            </TableHead>
                            <TableHead>
                                <Translation>winRate</Translation>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {headToHeadStats.map((stats) => (
                            <OpponentRow key={stats.opponentId} stats={stats} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
