import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export enum CurrentlySelectedRouteOptions {
    DASHBOARD = 'dashboard',
    RANKING = 'ranking',
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
