import { Link as RouterLink } from 'react-router-dom';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import { ResendEmailConfirmation } from '@/components/ResendEmailConfirmation';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';

export function RegisterSuccess() {
    return (
        <NotSignedInLayout illustration={<RegisterSVG className="m-16 w-full max-w-full" />}>
            <div className="grid gap-2 text-center">
                <Translation element="h1">registerSuccess.headline</Translation>
                <Translation element="p" as="mutedText">
                    registerSuccess.alert
                </Translation>
            </div>
            <ResendEmailConfirmation />
            <div className="mt-4 text-center text-sm">
                <RouterLink to="/login" className="underline">
                    <Translation>backToLogin</Translation>
                </RouterLink>
            </div>
        </NotSignedInLayout>
    );
}
