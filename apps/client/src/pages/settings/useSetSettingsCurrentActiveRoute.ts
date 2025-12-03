import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export enum CurrentSettingsRouteOptions {
    PROFILE = 'profile',
    LANGUAGE = 'language',
}

export const useSetSettingsCurrentActiveRoute = (currentlySelectedRoute: CurrentSettingsRouteOptions) => {
    const { setCurrentlySelectedRoute } = useOutletContext<{
        setCurrentlySelectedRoute: (currentlySelectedRoute: CurrentSettingsRouteOptions) => void;
    }>();
    useEffect(() => {
        setCurrentlySelectedRoute(currentlySelectedRoute);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentlySelectedRoute]);
};
