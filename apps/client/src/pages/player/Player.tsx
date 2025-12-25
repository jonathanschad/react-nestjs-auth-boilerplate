import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { useParams } from 'react-router-dom';
import { AverageHistoryChart } from '@/pages/player/AverageHistoryChart';
import { EloHistoryChart } from '@/pages/player/EloHistoryChart';
import { GameHistory } from '@/pages/player/GameHistory';
import { HeadToHead } from '@/pages/player/HeadToHead';
import { PlayerOverview } from '@/pages/player/PlayerOverview';

export const Player = () => {
    const params = useParams<{ uuid: string }>();
    const uuid = params.uuid;

    if (!uuid) {
        return (
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <Typography as="h1">
                    <Translation>Did not find player id, please check the url.</Translation>
                </Typography>
            </div>
        );
    }

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
            <PlayerOverview playerId={uuid} />
            <EloHistoryChart playerUuid={uuid} />
            <AverageHistoryChart playerUuid={uuid} />
            <HeadToHead playerUuid={uuid} />
            <GameHistory playerId={uuid} />
        </div>
    );
};
