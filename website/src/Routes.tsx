import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';

import NotFoundPage from '@/pages/404';
import CompleteRegister from '@/pages/CompleteRegister';
import { ConfirmEmail } from '@/pages/ConfirmEmail';
import ConnectGoogleAccountCompletion from '@/pages/ConnectGoogleAccountCompletion';
import { Home } from '@/pages/Home';
import LoadingApplication from '@/pages/LoadingApplication';
import { Login } from '@/pages/Login';
import { PasswordForgot } from '@/pages/PasswordForgot';
import { PasswordForgotSuccess } from '@/pages/PasswordForgotSuccess';
import { PasswordReset } from '@/pages/PasswordReset';
import Register from '@/pages/Register';
import { RegisterSuccess } from '@/pages/RegisterSuccess';
import { UserState, useStore } from '@/store/store';

const routerFactory = (userState: UserState | undefined | null, shouldRenewAccessToken: boolean) => {
    const isLoggedIn = Boolean(userState);
    const routes: RouteObject[] = [
        {
            path: '/load-application',
            element: <LoadingApplication />,
        },
    ];

    if (shouldRenewAccessToken) {
        console.log('Renewing access token', shouldRenewAccessToken);

        return [
            {
                path: '*',
                element: <LoadingApplication />,
            },
        ];
    }
    if (userState === UserState.VERIFIED) {
        routes.push(
            {
                path: '/register/complete',
                element: <CompleteRegister />,
            },
            {
                path: '*',
                element: <Navigate replace to="/register/complete" />,
            },
        );
    }
    if (userState === UserState.COMPLETE) {
        routes.push({
            path: '/',
            element: <Home />,
        });
    }
    if (!isLoggedIn) {
        routes.push(
            {
                path: '/',
                element: <Login />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/register/success',
                element: <RegisterSuccess />,
            },
            {
                path: '/password-forgot',
                element: <PasswordForgot />,
            },
            {
                path: '/password-forgot/success',
                element: <PasswordForgotSuccess />,
            },
            {
                path: '/password-reset',
                element: <PasswordReset />,
            },
            {
                path: '/verify-email-token',
                element: <ConfirmEmail />,
            },
            {
                path: '/google-oauth/connect-accounts',
                element: <ConnectGoogleAccountCompletion />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        );
    }
    routes.push({
        path: '*',
        element: <Home />,
    });
    return routes;
};

export const Routes = () => {
    const userState = useStore((state) => state.decodedAccessToken()?.state);
    const shouldRenewAccessToken = useStore((state) => {
        return !state.accessToken && state.isLoggedIn;
    });
    const router = useMemo(() => routerFactory(userState, shouldRenewAccessToken), [userState, shouldRenewAccessToken]);
    return <RouterProvider router={createBrowserRouter(router)}></RouterProvider>;
};
