import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { Translation } from '@/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

export const TermsOfService = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Translation element={'h1'}>termsOfService</Translation>
            <p className="mt-4 text-center">
                This is a placeholder for the termsOfService. Please replace this page with your own termsOfService.
            </p>
        </div>
    );
};

const TermsOfServiceIllustration = <LegalSVG className="m-8 w-full max-w-full" />;

export const NotSignedInTermsOfService = () => {
    useSetNotSignedInLayoutIllustration(TermsOfServiceIllustration);
    return (
        <div className="mx-16 grid w-full gap-6">
            <TermsOfService />
        </div>
    );
};
