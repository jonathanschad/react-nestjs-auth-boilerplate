import Markdown from 'react-markdown';
import { useQuery } from 'react-query';

import LegalSVG from '@/assets/illustrations/legal.svg?react';
import { Translation } from '@/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { getDataPrivacyPolicy } from '@/repository/privacy-policy';

export const PrivacyPolicy = () => {
    const { isLoading, data } = useQuery({
        queryFn: () => getDataPrivacyPolicy(),
        retry: false,
    });

    if (isLoading) return <div>Loading...</div>;
    return (
        <div className="h-full pb-12">
            <Translation element={'h1'}>privacyPolicy</Translation>
            <Markdown>{data}</Markdown>
        </div>
    );
};

const PrivacyPolicyIllustration = <LegalSVG className="m-8 w-full max-w-full" />;

export const NotSignedInPrivacyPolicy = () => {
    useSetNotSignedInLayoutIllustration(PrivacyPolicyIllustration);
    return (
        <div className="grid h-full w-full gap-6 overflow-y-auto px-16">
            <PrivacyPolicy />
        </div>
    );
};
