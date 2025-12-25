import { Button } from '@boilerplate/ui/components/button';
import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { completeGoogleAccountConnection } from '@/api/auth/useCompleteGoogleAccountConnection';
import RegisterSVG from '@/assets/illustrations/register.svg?react';
import {
    type ConnectGoogleAccountFormValues,
    connectGoogleAccountFormOptions,
} from '@/forms/connect-google-account-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';

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
        } catch (_error) {
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

    const form = useAppForm({
        ...connectGoogleAccountFormOptions(t),
        onSubmit: ({ value }) => {
            handleSubmit(value);
        },
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
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void form.handleSubmit();
                }}
                className="grid gap-4"
            >
                <div className="grid gap-2">
                    <Label htmlFor="email">
                        <Translation>email</Translation>
                    </Label>
                    <Input id="email" name="email" disabled value={decodedConnectToken.googleEmail} />
                </div>
                <form.AppField
                    name="password"
                    children={(field) => (
                        <field.TextField type="password" autoComplete="current-password" label={t('password')} />
                    )}
                />
                <Button type="submit" className="w-full">
                    <Translation>connectGoogleAccount.connectAccount</Translation>
                </Button>
            </form>
        </div>
    );
}
