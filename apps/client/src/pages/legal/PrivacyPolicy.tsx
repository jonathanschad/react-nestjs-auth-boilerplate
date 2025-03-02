import { useQuery } from 'react-query';

import LegalSVG from '@client/assets/illustrations/legal.svg?react';
import { Loading } from '@client/components/Loading';
import { MarkdownRenderer } from '@client/components/MarkdownRenderer';
import { useSetNotSignedInLayoutIllustration } from '@client/layout/useSetNotSignedInLayoutIllustration';
import { getDataPrivacyPolicy } from '@client/repository/privacy-policy';

export const PrivacyPolicy = () => {
    const { isLoading, data } = useQuery({
        queryFn: () => getDataPrivacyPolicy(),
        retry: false,
    });

    return (
        <Loading isLoading={isLoading}>
            <div className="h-full pb-12">
                <MarkdownRenderer>{data}</MarkdownRenderer>
            </div>
        </Loading>
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
