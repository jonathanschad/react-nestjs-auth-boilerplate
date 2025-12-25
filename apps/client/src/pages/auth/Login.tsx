import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Outlet } from 'react-router-dom';
import LoginSVG from '@/assets/illustrations/login.svg?react';
import { GoogleOAuthButton } from '@/components/google-oauth-button/GoogleOAuthButton';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

const LoginIllustration = <LoginSVG className="m-8 w-full max-w-full" />;

export function Login() {
    useSetNotSignedInLayoutIllustration(LoginIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <Outlet context={{ illustration: <LoginSVG className="m-8 w-full max-w-full" /> }} />
            <div className="grid gap-2 text-center">
                <Translation element="h1">login</Translation>
                <Translation element="p" as="mutedText">
                    loginSubHeadline
                </Translation>
            </div>
            <GoogleOAuthButton />
        </div>
    );
}
