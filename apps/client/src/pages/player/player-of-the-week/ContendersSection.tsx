import { PlayerOfTheWeekEntityDTO } from '@boilerplate/types';
import { Button } from '@boilerplate/ui/components/button';
import { DataTable } from '@boilerplate/ui/components/data-table';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

interface ContendersSectionProps {
    contenders: PlayerOfTheWeekEntityDTO[];
}

const contenderColumns: ColumnDef<PlayerOfTheWeekEntityDTO>[] = [
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

export const ContendersSection = ({ contenders }: ContendersSectionProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
                <Translation>currentWeekContenders</Translation>
            </h2>
            <DataTable data={contenders} columns={contenderColumns} pageSize={10} />
        </div>
    );
};
