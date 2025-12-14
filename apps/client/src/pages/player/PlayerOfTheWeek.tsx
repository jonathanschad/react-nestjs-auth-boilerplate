import { PlayerOfTheWeekEntityDTO } from '@darts/types';
import { Translation } from '@darts/ui/i18n/Translation';
import { useGetPlayerOfTheWeekContender, useGetPlayerOfTheWeekHistory } from '@/api/dart/player/useGetPlayerOfTheWeek';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { ContendersSection } from '@/pages/player/player-of-the-week/ContendersSection';
import { HistorySection } from '@/pages/player/player-of-the-week/HistorySection';
import { NoGamesCard } from '@/pages/player/player-of-the-week/NoGamesCard';
import { PlayerOfTheWeekCard } from '@/pages/player/player-of-the-week/PlayerOfTheWeekCard';

export const PlayerOfTheWeek = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.PLAYER_OF_THE_WEEK);

    const {
        data: contenders,
        isLoading: isLoadingContenders,
        error: contendersError,
    } = useGetPlayerOfTheWeekContender();
    const { data: history, isLoading: isLoadingHistory, error: historyError } = useGetPlayerOfTheWeekHistory();

    if (isLoadingContenders || isLoadingHistory) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>playerOfTheWeek</Translation>
                </h1>
                <div className="mt-4">
                    <Translation>loading</Translation>
                </div>
            </div>
        );
    }

    if (contendersError || historyError) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">
                    <Translation>playerOfTheWeek</Translation>
                </h1>
                <div className="mt-4">
                    <Translation>errorLoadingData</Translation>
                </div>
            </div>
        );
    }

    const hasGamesThisWeek = contenders && contenders.length > 0;

    if (!hasGamesThisWeek) {
        return (
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
                <h1 className="flex-shrink-0 text-3xl font-semibold">
                    <Translation>playerOfTheWeek</Translation>
                </h1>
                <NoGamesCard />
                <HistorySection history={history || []} />
            </div>
        );
    }

    const topContender: PlayerOfTheWeekEntityDTO = contenders[0];

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
            <h1 className="flex-shrink-0 text-3xl font-semibold">
                <Translation>playerOfTheWeek</Translation>
            </h1>

            <PlayerOfTheWeekCard topContender={topContender} type="current-leader" />

            <ContendersSection contenders={contenders} />

            <HistorySection history={history || []} />
        </div>
    );
};
