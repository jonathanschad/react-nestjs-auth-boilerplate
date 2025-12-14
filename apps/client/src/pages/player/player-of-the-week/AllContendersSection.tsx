import { PlayerOfTheWeekContenderDTO } from '@darts/types';
import { Button } from '@darts/ui/components/button';
import { DataTable } from '@darts/ui/components/data-table';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Medal } from 'lucide-react';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

interface AllContendersSectionProps {
    contenders: PlayerOfTheWeekContenderDTO[];
}

const getRankIcon = (rank: number) => {
    if (rank === 1) {
        return <Medal className="h-5 w-5 text-yellow-500" />;
    }
    if (rank === 2) {
        return <Medal className="h-5 w-5 text-gray-400" />;
    }
    if (rank === 3) {
        return <Medal className="h-5 w-5 text-amber-600" />;
    }
    return null;
};

const allContendersColumns: ColumnDef<PlayerOfTheWeekContenderDTO & { rank: number }>[] = [
    {
        accessorKey: 'rank',
        header: () => {
            return (
                <div className="pl-0">
                    <Translation>rank</Translation>
                </div>
            );
        },
        cell: ({ row }) => {
            const rank = row.original.rank;
            const icon = getRankIcon(rank);
            return (
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-semibold">{rank}</span>
                </div>
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
        accessorKey: 'scoringAverage',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>scoringAverage</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.scoringAverage.toFixed(1)}</div>,
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

export const AllContendersSection = ({ contenders }: AllContendersSectionProps) => {
    const contendersWithRank = contenders.map((contender, index) => ({
        ...contender,
        rank: index + 1,
    }));

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
                <Translation>weekRankings</Translation>
            </h2>
            <DataTable data={contendersWithRank} columns={allContendersColumns} pageSize={10} />
        </div>
    );
};
