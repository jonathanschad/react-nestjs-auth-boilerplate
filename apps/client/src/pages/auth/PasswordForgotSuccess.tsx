import { Button } from '@darts/ui/components/button';
import { Translation } from '@darts/ui/i18n/Translation';
import { Link } from 'react-router-dom';

import ForgotPasswordSVG from '@/assets/illustrations/forgot-password.svg?react';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

const PasswordForgotIllustration = <ForgotPasswordSVG className="w-1/2 max-w-full" />;

export function PasswordForgotSuccess() {
    useSetNotSignedInLayoutIllustration(PasswordForgotIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1">passwordRequested</Translation>
                <Translation element="p" as="normalText">
                    passwordRequestedSubheadline
                </Translation>
                <Translation element="p" as="mutedText">
                    passwordRequestedCaption
                </Translation>
            </div>
            <Link to="/login">
                <Button className="w-full">
                    <Translation>toLogin</Translation>
                </Button>
            </Link>
        </div>
    );
}
