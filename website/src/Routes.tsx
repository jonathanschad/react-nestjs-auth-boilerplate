import { useMemo } from 'react';
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from 'react-router-dom';

import NotFoundPage from '@/pages/404';
import { Login } from '@/pages/auth/Login';
import { PasswordForgot } from '@/pages/auth/PasswordForgot';
import { PasswordForgotSuccess } from '@/pages/auth/PasswordForgotSuccess';
import { PasswordReset } from '@/pages/auth/PasswordReset';
import { Home } from '@/pages/Home';
import { NotSignedInImprint, SignedInImprint } from '@/pages/legal/Imprint';
import { NotSignedInTermsOfService, SignedInTermsOfService } from '@/pages/legal/TermsOfService';
import { Settings } from '@/pages/settings/Settings';
import CompleteRegister from '@/pages/signup/CompleteRegister';
import { ConfirmEmail } from '@/pages/signup/ConfirmEmail';
import ConnectGoogleAccountCompletion from '@/pages/signup/google/ConnectGoogleAccountCompletion';
import Register from '@/pages/signup/Register';
import { RegisterSuccess } from '@/pages/signup/RegisterSuccess';
import { UserState, useStore } from '@/store/store';

const routerFactory = (userState: UserState | undefined | null) => {
    const isLoggedIn = Boolean(userState);
    const routes: RouteObject[] = [];
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
        routes.push(
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/imprint',
                element: <SignedInImprint />,
            },
            {
                path: '/terms',
                element: <SignedInTermsOfService />,
            },
            {
                path: '*',
                element: <Navigate replace to="/" />,
            },
        );
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
                path: '/imprint',
                element: <NotSignedInImprint />,
            },
            {
                path: '/terms',
                element: <NotSignedInTermsOfService />,
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        );
    }
    return routes;
};

export const Routes = () => {
    const userState = useStore((state) => state.decodedAccessToken()?.state);
    const router = useMemo(() => routerFactory(userState), [userState]);
    return <RouterProvider router={createBrowserRouter(router)}></RouterProvider>;
};
