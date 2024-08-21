import { useMemo } from 'react';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';

import NotFoundPage from '@/pages/404';
import { ConfirmEmail } from '@/pages/ConfirmEmail';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { PasswordForgot } from '@/pages/PasswordForgot';
import { PasswordForgotSuccess } from '@/pages/PasswordForgotSuccess';
import { PasswordReset } from '@/pages/PasswordReset';
import Register from '@/pages/Register';
import { RegisterSuccess } from '@/pages/RegisterSuccess';
import { useStore } from '@/store/store';

const routerFactory = (isLoggedIn: boolean) => {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: isLoggedIn ? <Home /> : <Login />,
        },
    ];
    if (!isLoggedIn) {
        routes.push(
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
                path: '*',
                element: <NotFoundPage />,
            },
        );
    }
    routes.push({
        path: '*',
        element: <Home />,
    });
    return createBrowserRouter(routes);
};

export const Routes = () => {
    const isLoggedIn = useStore((state) => state.isLoggedIn);
    const router = useMemo(() => routerFactory(isLoggedIn), [isLoggedIn]);
    return <RouterProvider router={router}></RouterProvider>;
};
