import type { EloRankingResponseDTO } from '@darts/types/api/ranking/ranking.dto';
import { Button } from '@darts/ui/components/button';
import { DataTable } from '@darts/ui/components/data-table';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useQuery } from 'react-query';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { getEloRankings } from '@/repository/ranking';

export const Ranking = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.RANKING);

    const { data: rankings, isLoading, error } = useQuery('eloRankings', getEloRankings);

    if (isLoading) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>ranking</Translation>
                </h1>
                <div className="mt-4">
                    <p>Loading rankings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>ranking</Translation>
                </h1>
                <div className="mt-4">
                    <p>Error loading rankings. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-2">
            <h1 className="flex-shrink-0 text-3xl font-semibold">
                <Translation>ranking</Translation>
            </h1>
            <div className="mt-4 flex-auto overflow-auto">
                <DataTable data={rankings || []} columns={columns} />
            </div>
        </div>
    );
};

const columns: ColumnDef<EloRankingResponseDTO>[] = [
    {
        id: 'rank',
        header: () => <Translation>rank</Translation>,
        cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: 'userName',
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
            const displayName = row.original.user.name || 'Unknown';
            return <div>{displayName}</div>;
        },
    },
    {
        accessorKey: 'ranking',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>eloRating</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-semibold">{Math.round(row.original.rating)}</div>,
    },
];
