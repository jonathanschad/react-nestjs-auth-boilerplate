import type { EloRankingResponseDTO } from '@darts/types/api/ranking/ranking.dto';
import { Button } from '@darts/ui/components/button';
import { DataTable } from '@darts/ui/components/data-table';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useGetEloRanking } from '@/api/dart/ranking/useGetEloRanking';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

export const EloRanking = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.ELO_RANKING);

    const { data: eloRankings, isLoading, error } = useGetEloRanking();

    if (isLoading) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>eloRating</Translation>
                </h1>
                <div className="mt-4">
                    <Translation>loading</Translation>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>eloRating</Translation>
                </h1>
                <div className="mt-4">
                    <Translation>errorLoadingData</Translation>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-2">
            <h1 className="flex-shrink-0 text-3xl font-semibold">
                <Translation>eloRating</Translation>
            </h1>

            <div className="flex-auto overflow-auto">
                <DataTable data={eloRankings || []} columns={eloColumns} pageSize={20} />
            </div>
        </div>
    );
};

const eloColumns: ColumnDef<EloRankingResponseDTO>[] = [
    {
        accessorKey: 'rank',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>rank</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.original.rank}</div>,
    },
    {
        accessorKey: 'user.name',
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
            return <UserTableCell userUuid={row.original.userId} />;
        },
    },
    {
        accessorKey: 'rating',
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
        cell: ({ row }) => <div className="font-semibold">{row.original.rating.elo.toFixed(1)}</div>,
    },
    {
        accessorKey: 'gamesPlayed',
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
        cell: ({ row }) => <div>{row.original.gamesPlayed}</div>,
    },
];
