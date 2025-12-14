import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export enum CurrentlySelectedRouteOptions {
    DASHBOARD = 'dashboard',
    ELO_RANKING = 'elo-ranking',
    OPENSKILL_RANKING = 'openskill-ranking',
    GAMES = 'games',
    PLAYER_OF_THE_WEEK = 'player-of-the-week',
    SETTINGS = 'settings',
}

export const useSetSignedInCurrentActiveRoute = (currentlySelectedRoute: CurrentlySelectedRouteOptions) => {
    const { setCurrentlySelectedRoute } = useOutletContext<{
        setCurrentlySelectedRoute: (currentlySelectedRoute: CurrentlySelectedRouteOptions) => void;
    }>();
    useEffect(() => {
        setCurrentlySelectedRoute(currentlySelectedRoute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentlySelectedRoute]);
};
