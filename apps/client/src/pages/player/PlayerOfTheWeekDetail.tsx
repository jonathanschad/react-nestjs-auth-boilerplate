import { Button } from '@darts/ui/components/button';
import { Translation } from '@darts/ui/i18n/Translation';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPlayerOfTheWeekDetails } from '@/api/dart/player/useGetPlayerOfTheWeek';
import {
    CurrentlySelectedRouteOptions,
    useSetSignedInCurrentActiveRoute,
} from '@/layout/useSetSignedInCurrentActiveRoute';
import { AllContendersSection } from '@/pages/player/player-of-the-week/AllContendersSection';
import { PlayerOfTheWeekCard } from '@/pages/player/player-of-the-week/PlayerOfTheWeekCard';

export const PlayerOfTheWeekDetail = () => {
    useSetSignedInCurrentActiveRoute(CurrentlySelectedRouteOptions.PLAYER_OF_THE_WEEK);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetPlayerOfTheWeekDetails({ id: id || '' });

    if (isLoading) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/player-of-the-week')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-semibold">
                        <Translation>playerOfTheWeek</Translation>
                    </h1>
                </div>
                <div className="mt-4">
                    <Translation>loading</Translation>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/player-of-the-week')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-semibold">
                        <Translation>playerOfTheWeek</Translation>
                    </h1>
                </div>
                <div className="mt-4">
                    <Translation>errorLoadingData</Translation>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/player-of-the-week')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="flex-shrink-0 text-3xl font-semibold">
                    <Translation>playerOfTheWeekDetails</Translation>
                </h1>
            </div>

            <PlayerOfTheWeekCard topContender={data.winner} type="winner" />

            <AllContendersSection contenders={data.allContenders} />
        </div>
    );
};
