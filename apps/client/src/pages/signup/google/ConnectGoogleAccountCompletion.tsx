import { useFormik } from 'formik';
import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@boilerplate/ui/components/button';
import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { Translation } from '@boilerplate/ui/i18n/Translation';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import {
    connectGoogleAccountFormValidationSchema,
    ConnectGoogleAccountFormValues,
    initialConnectGoogleAccountFormValues,
} from '@/forms/connect-google-account-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { completeGoogleAccountConnection } from '@/repository/login';

type ConnectTokenType = { googleOAuthId: string; googleEmail: string; name: string; secret: string };
const ConnectGoogleAccountCompletionIllustration = <RegisterSVG className="m-16 w-full max-w-full" />;
export default function ConnectGoogleAccountCompletion() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const connectToken = useMemo(() => searchParams.get('connectToken'), [searchParams]);
    const decodedConnectToken = useMemo(() => {
        try {
            return jwtDecode<ConnectTokenType>(connectToken ?? '');
        } catch (error) {
            return;
        }
    }, [connectToken]);

    const registerMutation = useMutation({
        mutationFn: completeGoogleAccountConnection,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            navigate('/');
        },
    });

    const handleSubmit = (data: ConnectGoogleAccountFormValues) => {
        console.log(data);
        if (connectToken) registerMutation.mutate({ token: connectToken, ...data });
    };
    const { t } = useTranslation('common');

    const formik = useFormik({
        initialValues: initialConnectGoogleAccountFormValues,
        validationSchema: connectGoogleAccountFormValidationSchema(t),
        onSubmit: handleSubmit,
    });

    useSetNotSignedInLayoutIllustration(ConnectGoogleAccountCompletionIllustration);

    if (!decodedConnectToken) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1">connectGoogleAccount.headline</Translation>
                <Translation element="p" as="mutedText" translationParams={{ email: decodedConnectToken.googleEmail }}>
                    connectGoogleAccount.explain
                </Translation>
            </div>
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">
                        <Translation>email</Translation>
                    </Label>
                    <Input id="email" name="email" disabled value={decodedConnectToken.googleEmail} />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">
                            <Translation>password</Translation>
                        </Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        name="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        errorMessage={formik.touched.password && formik.errors.password}
                    />
                </div>
                <Button type="submit" className="w-full">
                    <Translation>connectGoogleAccount.connectAccount</Translation>
                </Button>
            </form>
        </div>
    );
}
