import type { HeadToHeadStats } from '@boilerplate/types';
import { Button } from '@boilerplate/ui/components/button';
import { Card } from '@boilerplate/ui/components/card';
import { Skeleton } from '@boilerplate/ui/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@boilerplate/ui/components/table';
import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useGetPlayerOpponentsWithHeadToHead } from '@/api/dart/player/useGetPlayerOpponents';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

type OpponentRowProps = {
    stats: HeadToHeadStats;
};

type SortField = 'winRate' | 'totalGames' | 'wins' | 'losses';
type SortOrder = 'asc' | 'desc';

const OpponentRow = ({ stats }: OpponentRowProps) => {
    return (
        <TableRow>
            <TableCell>
                <UserTableCell userUuid={stats.opponent.id} showName={true} avatarSize="sm" />
            </TableCell>
            <TableCell>
                <Typography as="normalText">{stats.totalGames}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">
                    {stats.player.wins}W - {stats.player.losses}L
                </Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">{(stats.player.winRate * 100).toFixed(1)}%</Typography>
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

export const HeadToHead = ({ playerUuid }: { playerUuid: string }) => {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortField>('winRate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const pageSize = 5;

    const {
        data: headToHeadStats,
        isLoading: headToHeadStatsLoading,
        error: headToHeadStatsError,
    } = useGetPlayerOpponentsWithHeadToHead(playerUuid);

    // Sort and paginate data client-side
    const { sortedAndPaginatedData, totalPages, totalCount } = useMemo(() => {
        if (!headToHeadStats) {
            return { sortedAndPaginatedData: [], totalPages: 0, totalCount: 0 };
        }

        // Sort the data
        const sorted = [...headToHeadStats].sort((a, b) => {
            let aValue: number;
            let bValue: number;

            switch (sortBy) {
                case 'winRate':
                    aValue = a.player.winRate;
                    bValue = b.player.winRate;
                    break;
                case 'totalGames':
                    aValue = a.totalGames;
                    bValue = b.totalGames;
                    break;
                case 'wins':
                    aValue = a.player.wins;
                    bValue = b.player.wins;
                    break;
                case 'losses':
                    aValue = a.player.losses;
                    bValue = b.player.losses;
                    break;
                default:
                    aValue = a.player.winRate;
                    bValue = b.player.winRate;
            }

            const multiplier = sortOrder === 'asc' ? 1 : -1;
            return (aValue - bValue) * multiplier;
        });

        // Paginate the sorted data
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = sorted.slice(startIndex, endIndex);

        return {
            sortedAndPaginatedData: paginated,
            totalPages: Math.ceil(sorted.length / pageSize),
            totalCount: sorted.length,
        };
    }, [headToHeadStats, sortBy, sortOrder, page, pageSize]);

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            // Toggle sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // New sort field, default to desc
            setSortBy(field);
            setSortOrder('desc');
        }
        setPage(1); // Reset to first page when sorting changes
    };

    const getSortIcon = (field: SortField) => {
        if (sortBy !== field) {
            return <ArrowUpDown className="ml-1 h-4 w-4" />;
        }
        return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />;
    };

    if (headToHeadStatsLoading) {
        return <HeadToHeadSkeleton />;
    }

    if (headToHeadStatsError || !headToHeadStats) {
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
                            <TableHead
                                className="cursor-pointer select-none hover:bg-muted/50"
                                onClick={() => handleSort('totalGames')}
                            >
                                <div className="flex items-center">
                                    <Translation>gamesPlayed</Translation>
                                    {getSortIcon('totalGames')}
                                </div>
                            </TableHead>
                            <TableHead>
                                <Translation>record</Translation>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer select-none hover:bg-muted/50"
                                onClick={() => handleSort('winRate')}
                            >
                                <div className="flex items-center">
                                    <Translation>winRate</Translation>
                                    {getSortIcon('winRate')}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndPaginatedData.map((stats) => (
                            <OpponentRow key={stats.opponent.id} stats={stats} />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <Typography as="smallText" className="text-muted-foreground">
                        <Translation>page</Translation> {page} <Translation>of</Translation> {totalPages} ({totalCount}{' '}
                        <Translation>opponent</Translation>
                        {totalCount !== 1 ? 's' : ''})
                    </Typography>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <Translation>previous</Translation>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <Translation>next</Translation>
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};
