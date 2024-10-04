import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';
import { SignedInLayout } from '@/layout/SignedInLayout';

const Imprint = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">
                <Translation>imprint</Translation>
            </h1>
            <p className="mt-4 text-center">
                This is a placeholder for the imprint. Please replace this page with your own imprint.
            </p>
        </div>
    );
};

export const SignedInImprint = () => {
    return (
        <SignedInLayout>
            <Imprint />
        </SignedInLayout>
    );
};

export const NotSignedInImprint = () => {
    return (
        <NotSignedInLayout illustration={<LegalSVG className="m-8 w-full max-w-full" />}>
            <Imprint />
        </NotSignedInLayout>
    );
};
