import { Link as RouterLink } from 'react-router-dom';

import { Translation } from '@boilerplate/ui/i18n/Translation';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import { ResendEmailConfirmation } from '@/components/ResendEmailConfirmation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

const RegisterSuccessIllustration = <RegisterSVG className="m-16 w-full max-w-full" />;

export function RegisterSuccess() {
    useSetNotSignedInLayoutIllustration(RegisterSuccessIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
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
        </div>
    );
}
