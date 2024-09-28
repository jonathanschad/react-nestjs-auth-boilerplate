import { Link } from 'react-router-dom';

import ForgotPasswordSVG from '@/assets/illustrations/forgot-password.svg?react';
import { Button } from '@/components/ui/button';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';

export function PasswordForgotSuccess() {
    return (
        <NotSignedInLayout illustration={<ForgotPasswordSVG className="w-1/2 max-w-full" />}>
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
        </NotSignedInLayout>
    );
}
