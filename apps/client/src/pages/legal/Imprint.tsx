import { Translation } from '@darts/ui/i18n/Translation';

import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { config } from '@/config';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

export const Imprint = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Translation as={'h1'}>imprint</Translation>
            <div className="mt-4 text-center">
                <ul>
                    <li>{config.IMPRINT_CONTACT_1}</li>
                    <li>{config.IMPRINT_CONTACT_2}</li>
                    <li>{config.IMPRINT_CONTACT_3}</li>
                    <li>{config.IMPRINT_CONTACT_4}</li>
                    <li>{config.IMPRINT_COPYRIGHT}</li>
                </ul>
            </div>
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
