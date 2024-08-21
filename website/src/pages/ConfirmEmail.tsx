import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

import CertificationSVG from '@/assets/illustrations/certification.svg?react';
import { ResendEmailConfirmation } from '@/components/ResendEmailConfirmation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';
import { confirmEmail } from '@/repository/login';

export const ConfirmEmail = () => {
    const [searchParams] = useSearchParams();
    const token = useMemo(() => searchParams.get('token'), [searchParams]);

    const email = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode<{ email?: string }>(token).email ?? null;
        } catch {
            return null;
        }
    }, [token]);

    const navigate = useNavigate();

    const { isLoading } = useQuery({
        queryFn: () => confirmEmail({ token }),
        onSuccess: (success) => {
            if (success) navigate('/');
        },
        enabled: Boolean(email),
        retry: false,
    });

    return (
        <NotSignedInLayout illustration={<CertificationSVG className="w-1/2" />}>
            <div>
                {isLoading ? (
                    <>
                        <div className="flex items-center">
                            <Translation element="h1" as="h5" className="mr-4">
                                confirmEmail.weAreConfirming
                            </Translation>
                            <LoadingSpinner />
                        </div>
                        <div className="mt-2 flex flex-col items-center">
                            <Translation className="mt-4" element="p" as="normalText">
                                confirmEmail.redirect
                            </Translation>
                        </div>
                    </>
                ) : (
                    <>
                        <Translation element="h1" as="h5">
                            confirmEmail.couldNotConfirm
                        </Translation>
                        <div className="mt-2 flex flex-col items-center">
                            <Translation className="mb-4 mt-4" element="p" as="normalText">
                                confirmEmail.couldNotConfirmText
                            </Translation>
                            <ResendEmailConfirmation email={email} />
                        </div>
                    </>
                )}
                <div className="mt-4 text-center text-sm">
                    <RouterLink to="/login" className="underline">
                        <Translation>backToLogin</Translation>
                    </RouterLink>
                </div>
            </div>
        </NotSignedInLayout>
    );
};
