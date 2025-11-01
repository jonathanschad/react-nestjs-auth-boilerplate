import { Alert, AlertDescription } from '@boilerplate/ui/components/alert';
import { Button } from '@boilerplate/ui/components/button';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import ResetPasswordSVG from '@/assets/illustrations/reset-password.svg?react';
import { passwordResetFormOptions } from '@/forms/password-reset';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { passwordChangeToken, passwordForgotTokenValidation } from '@/repository/password';

const PasswordResetIllustration = <ResetPasswordSVG className="w-1/2 max-w-full" />;

export function PasswordReset() {
    const [searchParams] = useSearchParams();
    const token = useMemo(() => searchParams.get('token'), [searchParams]);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: isPasswordResetTokenValid = true } = useQuery({
        queryFn: () => passwordForgotTokenValidation({ token: token as string }),
        queryKey: ['password-reset', token],
        enabled: !!token,
    });
    const passwordChangeMutation = useMutation({
        mutationFn: passwordChangeToken,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            navigate('/');
        },
        onError: () => {
            // TODO
        },
    });
    const { t } = useTranslation('common');

    const form = useAppForm({
        ...passwordResetFormOptions(t),
        onSubmit: ({ value }) => {
            passwordChangeMutation.mutate({ ...value, token: token as string });
        },
    });

    useSetNotSignedInLayoutIllustration(PasswordResetIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1" className="mb-4">
                    passwordReset
                </Translation>
                {!isPasswordResetTokenValid ? (
                    <>
                        <Alert variant="destructive" className="my-4 text-left">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <Translation>passwordResetError</Translation>
                            </AlertDescription>
                        </Alert>
                        <Link to="/password-forgot">
                            <Button className="w-full">
                                <Translation>forgotPassword</Translation>
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" className="w-full">
                                <Translation>toLogin</Translation>
                            </Button>
                        </Link>
                    </>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void form.handleSubmit();
                        }}
                        className="grid gap-4"
                    >
                        <form.AppField
                            name="password"
                            children={(field) => (
                                <field.TextField type="password" autoComplete="new-password" label={t('password')} />
                            )}
                        />
                        <form.AppField
                            name="passwordRepeat"
                            children={(field) => (
                                <field.TextField
                                    type="password"
                                    autoComplete="new-password"
                                    label={t('passwordRepeat')}
                                />
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={!isPasswordResetTokenValid}>
                            <Translation>passwordReset</Translation>
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
