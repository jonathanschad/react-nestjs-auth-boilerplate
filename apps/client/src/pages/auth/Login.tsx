import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';

import { Button } from '@boilerplate/ui/components/button';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';

import LoginSVG from '@/assets/illustrations/login.svg?react';
import { GoogleOAuthButton } from '@/components/google-oauth-button/GoogleOAuthButton';
import { loginFormOptions } from '@/forms/login-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { login } from '@/repository/login';

const LoginIllustration = <LoginSVG className="m-8 w-full max-w-full" />;

export function Login() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: async () => {
            // Invalidate and refetch
            await queryClient.invalidateQueries();
            navigate('/');
        },
    });

    const { t } = useTranslation('common');

    const form = useAppForm({
        ...loginFormOptions(t),
        onSubmit: async ({ value }) => {
            await loginMutation.mutateAsync(value);
        },
    });

    useSetNotSignedInLayoutIllustration(LoginIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <Outlet context={{ illustration: <LoginSVG className="m-8 w-full max-w-full" /> }} />
            <div className="grid gap-2 text-center">
                <Translation element="h1">login</Translation>
                <Translation element="p" as="mutedText">
                    loginSubHeadline
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
                <form.AppField
                    name="email"
                    children={(field) => (
                        <field.TextField
                            type="email"
                            autoComplete="email"
                            label={t('email')}
                            placeholder={t('emailPlaceholder')}
                        />
                    )}
                />
                <form.AppField
                    name="password"
                    children={(field) => (
                        <field.TextField
                            type="password"
                            autoComplete="current-password"
                            label={
                                <div className="flex items-center">
                                    <Translation>password</Translation>
                                    <RouterLink
                                        to="/password-forgot"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        <Translation>forgotPassword</Translation>
                                    </RouterLink>
                                </div>
                            }
                            placeholder={t('passwordPlaceholder')}
                        />
                    )}
                />
                <form.AppField
                    name="remember"
                    children={(field) => <field.Checkbox label={<Translation>rememberMe</Translation>} />}
                />
                <Button type="submit" className="w-full">
                    <Translation>login</Translation>
                </Button>
                <GoogleOAuthButton />
            </form>
            <div className="mt-4 text-center text-sm">
                <Translation>noAccount</Translation>{' '}
                <RouterLink to="/register" className="underline">
                    <Translation>signup</Translation>
                </RouterLink>
            </div>
        </div>
    );
}
