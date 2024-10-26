import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { Translation } from '@/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

export const Imprint = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Translation as={'h1'}>imprint</Translation>
            <p className="mt-4 text-center">
                This is a placeholder for the imprint. Please replace this page with your own imprint.
            </p>
        </div>
    );
};

const ImprintIllustration = <LegalSVG className="m-8 w-full max-w-full" />;

export const NotSignedInImprint = () => {
    useSetNotSignedInLayoutIllustration(ImprintIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <Imprint />
        </div>
    );
};
