import type { EloRankingResponseDTO, OpenSkillRankingResponseDTO } from '@darts/types';
import { Button } from '@darts/ui/components/button';
import { DataTable } from '@darts/ui/components/data-table';
import { Translation } from '@darts/ui/i18n/Translation';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { useGetEloRanking } from '@/api/dart/ranking/useGetEloRanking';
import { useGetOpenSkillRanking } from '@/api/dart/ranking/useGetOpenSkillRanking';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

type RankingType = 'elo' | 'openskill';

export const Ranking = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.ELO_RANKING);
    const [rankingType, setRankingType] = useState<RankingType>('elo');

    const { data: eloRankings, isLoading: eloLoading, error: eloError } = useGetEloRanking();
    const { data: openSkillRankings, isLoading: openSkillLoading, error: openSkillError } = useGetOpenSkillRanking();

    const isLoading = rankingType === 'elo' ? eloLoading : openSkillLoading;
    const error = rankingType === 'elo' ? eloError : openSkillError;

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

            {/* Tab buttons */}
            <div className="mt-4 flex gap-2 border-b">
                <button
                    type="button"
                    onClick={() => setRankingType('elo')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        rankingType === 'elo'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Translation>eloRating</Translation>
                </button>
                <button
                    type="button"
                    onClick={() => setRankingType('openskill')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        rankingType === 'openskill'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Translation>openSkillRating</Translation>
                </button>
            </div>

            <div className="flex-auto overflow-auto">
                {rankingType === 'elo' ? (
                    <DataTable data={eloRankings || []} columns={eloColumns} pageSize={20} />
                ) : (
                    <DataTable data={openSkillRankings || []} columns={openSkillColumns} pageSize={20} />
                )}
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

const openSkillColumns: ColumnDef<OpenSkillRankingResponseDTO>[] = [
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
        accessorKey: 'score',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>score</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-semibold">{row.original.score.toFixed(2)}</div>,
    },
    {
        accessorKey: 'rating.mu',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>mu</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.rating.mu.toFixed(2)}</div>,
    },
    {
        accessorKey: 'rating.sigma',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="pl-0"
                >
                    <Translation>sigma</Translation>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.original.rating.sigma.toFixed(2)}</div>,
    },
];
