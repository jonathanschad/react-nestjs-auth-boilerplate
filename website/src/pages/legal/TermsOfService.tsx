import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { Translation } from '@/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/NotSignedInLayout';

export const TermsOfService = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">
                <Translation>termsOfService</Translation>
            </h1>
            <p className="mt-4 text-center">
                This is a placeholder for the termsOfService. Please replace this page with your own termsOfService.
            </p>
        </div>
    );
};

const TermsOfServiceIllustration = <LegalSVG className="m-8 w-full max-w-full" />;

export const NotSignedInTermsOfService = () => {
    useSetNotSignedInLayoutIllustration(TermsOfServiceIllustration);
    return <TermsOfService />;
};
