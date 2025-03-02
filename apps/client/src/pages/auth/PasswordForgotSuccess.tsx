import { Link } from 'react-router-dom';

import ForgotPasswordSVG from '@client/assets/illustrations/forgot-password.svg?react';
import { Button } from '@client/components/ui/button';
import { Translation } from '@client/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@client/layout/useSetNotSignedInLayoutIllustration';

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
