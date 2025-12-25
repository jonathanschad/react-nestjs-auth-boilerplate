import type { PlayerResponseDTO } from '@boilerplate/types';
import { Button } from '@boilerplate/ui/components/button';
import { DataTable } from '@boilerplate/ui/components/data-table';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';
import { useGetAllPlayers } from '@/api/dart/player/useGetAllPlayers';
import { useGetEloRanking } from '@/api/dart/ranking/useGetEloRanking';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

export const UnrankedPlayersList = () => {
    const { data: allPlayers, isLoading: allPlayersLoading, error: allPlayersError } = useGetAllPlayers();
    const { data: eloRankings, isLoading: eloLoading, error: eloError } = useGetEloRanking();

    const unrankedPlayers = useMemo(() => {
        if (!allPlayers) return [];

        const rankedPlayerIds = eloRankings?.map((ranking) => ranking.userId) ?? [];

        const rankedSet = new Set(rankedPlayerIds);
        return allPlayers.filter((player) => !rankedSet.has(player.id));
    }, [allPlayers, eloRankings]);

    if (allPlayersLoading || eloLoading) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-semibold">
                    <Translation>unrankedPlayers</Translation>
                </h2>
                <div className="mt-4">
                    <Translation>loading</Translation>
                </div>
            </div>
        );
    }

    if (allPlayersError || eloError) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-semibold">
                    <Translation>unrankedPlayers</Translation>
                </h2>
                <div className="mt-4">
                    <Translation>errorLoadingData</Translation>
                </div>
            </div>
        );
    }

    if (unrankedPlayers.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">
                <Translation>unrankedPlayers</Translation>
            </h2>
            <DataTable
                data={unrankedPlayers}
                columns={unrankedColumns}
                pageSize={5}
                initialSorting={[{ id: 'lastGamePlayedAt', desc: true }]}
            />
        </div>
    );
};

const unrankedColumns: ColumnDef<PlayerResponseDTO>[] = [
    {
        accessorKey: 'name',
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
            return <UserTableCell userUuid={row.original.id} />;
        },
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
    {
        accessorKey: 'lastGamePlayedAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>lastGamePlayedAt</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const lastPlayed = row.original.lastGamePlayedAt;
            if (!lastPlayed) {
                return <span className="text-muted-foreground">-</span>;
            }
            return <div>{new Date(lastPlayed).toLocaleDateString()}</div>;
        },
    },
];
