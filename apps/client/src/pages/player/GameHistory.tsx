import type { GameEntityApiDTO } from '@darts/types/api/game/game.dto';
import { EloHistoryEntityApiDTO } from '@darts/types/api/ranking/ranking.dto';
import { Button } from '@darts/ui/components/button';
import { Card } from '@darts/ui/components/card';
import { Skeleton } from '@darts/ui/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@darts/ui/components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@darts/ui/components/tooltip';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useGetPlayerGames } from '@/api/dart/player/useGetPlayerGames';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

type GameHistoryProps = {
    playerId: string;
};

const PlayerColumn = ({
    playerId,
    isWinner,
    elo,
}: {
    playerId: string;
    isWinner: boolean;
    elo: EloHistoryEntityApiDTO;
}) => {
    const eloChange = elo.eloAfter - elo.eloBefore;
    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <UserTableCell userUuid={playerId} showName={true} avatarSize="sm" />
                    {isWinner && <span>👑</span>}
                </div>
                {eloChange !== undefined && eloChange !== null && (
                    <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{elo.eloBefore.toFixed(1)}</span>
                        <span className={`text-xs font-medium ${eloChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {eloChange >= 0 ? '+' : ''}
                            {eloChange.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const gameColumns: ColumnDef<GameEntityApiDTO>[] = [
    {
        id: 'date',
        header: () => <Translation>date</Translation>,
        cell: ({ row }) => {
            const game = row.original;
            const duration = dayjs(game.gameEnd).diff(dayjs(game.gameStart), 'minute');
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>{dayjs(game.gameEnd).format('DD.MM.YYYY HH:mm')}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                <Translation as="normalText">duration</Translation>: {duration} min
                            </p>
                            <p>
                                <Translation as="normalText">gameStart</Translation>:{' '}
                                {dayjs(game.gameStart).format('DD.MM.YYYY HH:mm')}
                            </p>
                            <p>
                                <Translation as="normalText">gameEnd</Translation>:{' '}
                                {dayjs(game.gameEnd).format('DD.MM.YYYY HH:mm')}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        id: 'playerA',
        header: () => <Translation>playerA</Translation>,
        cell: ({ row }) => {
            const game = row.original;
            const isWinner = game.winnerId === game.playerA.id;

            return <PlayerColumn playerId={game.playerA.id} isWinner={isWinner} elo={game.playerA.eloHistory} />;
        },
    },
    {
        id: 'playerB',
        header: () => <Translation>playerB</Translation>,
        cell: ({ row }) => {
            const game = row.original;
            const isWinner = game.winnerId === game.playerB.id;

            return <PlayerColumn playerId={game.playerB.id} isWinner={isWinner} elo={game.playerB.eloHistory} />;
        },
    },
    {
        id: 'gameType',
        header: () => <Translation>gameType</Translation>,
        cell: ({ row }) => {
            return <span>{row.original.type}</span>;
        },
    },
];

export const GameHistorySkeleton = () => {
    return (
        <Card className="p-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        </Card>
    );
};

export const GameHistory = ({ playerId }: GameHistoryProps) => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, error } = useGetPlayerGames(playerId, page, pageSize);

    const table = useReactTable({
        data: data?.data ?? [],
        columns: gameColumns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: data?.pagination.totalPages ?? 0,
    });

    if (isLoading) {
        return <GameHistorySkeleton />;
    }

    if (error || !data) {
        return (
            <Card className="p-4">
                <Typography as="p">
                    <Translation>errorLoadingGameHistory</Translation>
                </Typography>
            </Card>
        );
    }

    const { pagination } = data;

    return (
        <Card className="flex flex-col p-4">
            <Typography as="h2" className="mb-4">
                <Translation>gameHistory</Translation>
            </Typography>

            {data.data.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                    <Typography as="mutedText">
                        <Translation>noGamesPlayed</Translation>
                    </Typography>
                </div>
            ) : (
                <>
                    <div className="overflow-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination controls */}
                    <div className="mt-4 flex items-center justify-between">
                        <Typography as="smallText" className="text-muted-foreground">
                            <Translation>page</Translation> {pagination.page} <Translation>of</Translation>{' '}
                            {pagination.totalPages} ({pagination.totalItems} <Translation>totalGames</Translation>)
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
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                <Translation>next</Translation>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};
