import { type ReactElement, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import { NotSignedInLayout } from '@/layout/NotSignedInLayout';
import { SignedInLayout } from '@/layout/SignedInLayout';
import { Login } from '@/pages/auth/Login';
import { PasswordForgot } from '@/pages/auth/PasswordForgot';
import { PasswordForgotSuccess } from '@/pages/auth/PasswordForgotSuccess';
import { PasswordReset } from '@/pages/auth/PasswordReset';
import { Home } from '@/pages/Home';
import { Imprint, NotSignedInImprint } from '@/pages/legal/Imprint';
import { License, NotSignedInLicense } from '@/pages/legal/License';
import { NotSignedInPrivacyPolicy, PrivacyPolicy } from '@/pages/legal/PrivacyPolicy';
import { Ranking } from '@/pages/ranking/Ranking';
import { GeneralSettings } from '@/pages/settings/GeneralSettings';
import { NotificationSettings } from '@/pages/settings/NotificationSettings';
import { ProfileSettings } from '@/pages/settings/ProfileSettings';
import { Settings } from '@/pages/settings/Settings';
import CompleteRegister from '@/pages/signup/CompleteRegister';
import { ConfirmEmail } from '@/pages/signup/ConfirmEmail';
import ConnectGoogleAccountCompletion from '@/pages/signup/google/ConnectGoogleAccountCompletion';
import Register from '@/pages/signup/Register';
import { RegisterSuccess } from '@/pages/signup/RegisterSuccess';
import { UserState, useStore } from '@/store/store';

const routesFactory = (userState: UserState | undefined | null) => {
    const isLoggedIn = Boolean(userState);
    const routes: ReactElement[] = [];

    if (userState === UserState.VERIFIED) {
        routes.push(
            <Route key="NotSignedInLayoutVerified" path="*" element={<NotSignedInLayout />}>
                <Route path="register/complete" element={<CompleteRegister />} />
                <Route path="*" element={<Navigate replace to="/register/complete" />} />
            </Route>,
        );
    }
    if (userState === UserState.COMPLETE) {
        routes.push(
            <Route key="SignedInLayout" path="*" element={<SignedInLayout />}>
                <Route index element={<Home />} />
                <Route path="ranking" element={<Ranking />} />
                <Route path="settings" element={<Settings />}>
                    <Route path="general" element={<GeneralSettings />} />
                    <Route path="notification" element={<NotificationSettings />} />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="*" element={<GeneralSettings />} />
                </Route>
                <Route path="imprint" element={<Imprint />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="licenses" element={<License />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>,
        );
    }
    if (!isLoggedIn) {
        routes.push(
            <Route key="SignedInLayout" path="*" element={<NotSignedInLayout />}>
                <Route index element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="register/success" element={<RegisterSuccess />} />
                <Route path="password-forgot" element={<PasswordForgot />} />
                <Route path="password-forgot/success" element={<PasswordForgotSuccess />} />
                <Route path="password-reset" element={<PasswordReset />} />
                <Route path="verify-email-token" element={<ConfirmEmail />} />
                <Route path="google-oauth/connect-accounts" element={<ConnectGoogleAccountCompletion />} />
                <Route path="imprint" element={<NotSignedInImprint />} />
                <Route path="privacy-policy" element={<NotSignedInPrivacyPolicy />} />
                <Route path="licenses" element={<NotSignedInLicense />} />
                <Route path="*" element={<Navigate replace to="/" />} />
            </Route>,
        );
    }
    return routes;
};

export const Routes = () => {
    const userState = useStore((state) => state.decodedAccessToken()?.state);
    const routes = useMemo(() => routesFactory(userState), [userState]);
    return (
        <BrowserRouter>
            <RouterRoutes>{routes}</RouterRoutes>
        </BrowserRouter>
    );
};
