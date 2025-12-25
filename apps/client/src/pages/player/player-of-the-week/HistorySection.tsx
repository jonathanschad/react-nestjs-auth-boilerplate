import { PlayerOfTheWeekEntityDTO } from '@boilerplate/types';
import { Button } from '@boilerplate/ui/components/button';
import { DataTable } from '@boilerplate/ui/components/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@boilerplate/ui/components/tooltip';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWeek } from '@/pages/player/player-of-the-week/utils';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

interface HistorySectionProps {
    history: PlayerOfTheWeekEntityDTO[];
}

interface PlayerWinCount {
    playerId: string;
    winCount: number;
}

const historyColumns: ColumnDef<PlayerOfTheWeekEntityDTO>[] = [
    {
        accessorKey: 'weekStart',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>weekStarting</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.weekStart);
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>{formatWeek(date)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                <Translation>from</Translation>: {dayjs(date).startOf('week').format('ddd, DD.MM.YYYY')}
                            </p>
                            <p>
                                <Translation>until</Translation>: {dayjs(date).endOf('week').format('ddd, DD.MM.YYYY')}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'playerId',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>player</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <UserTableCell userUuid={row.original.playerId} />;
        },
    },
    {
        accessorKey: 'eloDifference',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>eloDifference</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const value = row.original.eloDifference;
            return (
                <div
                    className={`font-semibold ${value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                    {value >= 0 ? '+' : ''}
                    {value.toFixed(1)}
                </div>
            );
        },
    },
    {
        accessorKey: 'openSkillDifference',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>openSkillDifference</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const value = row.original.openSkillDifference;
            return (
                <div
                    className={`font-semibold ${value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                    {value >= 0 ? '+' : ''}
                    {value.toFixed(1)}
                </div>
            );
        },
    },
    {
        accessorKey: 'averageScore',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>averageScore</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.averageScore.toFixed(1)}</div>,
    },
    {
        accessorKey: 'numberOfGames',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>gamesPlayed</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.numberOfGames}</div>,
    },
];

const winCountColumns: ColumnDef<PlayerWinCount>[] = [
    {
        accessorKey: 'playerId',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>player</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <UserTableCell userUuid={row.original.playerId} />;
        },
    },
    {
        accessorKey: 'winCount',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>numberOfWins</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-semibold">{row.original.winCount}</div>,
    },
];

export const HistorySection = ({ history }: HistorySectionProps) => {
    const navigate = useNavigate();

    const playerWinCounts = useMemo(() => {
        const winCountMap = new Map<string, number>();

        history.forEach((record) => {
            const currentCount = winCountMap.get(record.playerId) || 0;
            winCountMap.set(record.playerId, currentCount + 1);
        });

        return Array.from(winCountMap.entries())
            .map(([playerId, winCount]) => ({ playerId, winCount }))
            .sort((a, b) => b.winCount - a.winCount);
    }, [history]);

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    <Translation>allTimeWinners</Translation>
                </h2>
                <DataTable data={playerWinCounts} columns={winCountColumns} pageSize={5} />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    <Translation>previousWinners</Translation>
                </h2>
                <DataTable
                    data={history}
                    columns={historyColumns}
                    pageSize={10}
                    onRowClick={(row) => navigate(`/player-of-the-week/${row.id}`)}
                />
            </div>
        </div>
    );
};
