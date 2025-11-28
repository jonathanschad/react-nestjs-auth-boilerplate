import { Button } from '@darts/ui/components/button';
import { useAppForm } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import { GoogleOAuthButton } from '@/components/google-oauth-button/GoogleOAuthButton';
import { type RegisterFormValues, registerFormOptions } from '@/forms/register-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { register } from '@/repository/login';

const RegisterIllustration = <RegisterSVG className="m-16 w-full max-w-full" />;

export default function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            navigate('/register/success');
        },
    });

    const handleSubmit = (data: RegisterFormValues) => {
        sessionStorage.setItem('registerEmail', data.email);
        sessionStorage.setItem('registerEmailSentAt', String(Date.now()));
        console.log(data);
        registerMutation.mutate(data);
    };

    const { t } = useTranslation('common');

    const form = useAppForm({
        ...registerFormOptions(t),
        onSubmit: ({ value }) => {
            handleSubmit(value);
        },
    });

    useSetNotSignedInLayoutIllustration(RegisterIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1">register</Translation>
                <Translation element="p" as="mutedText">
                    registerSubHeadline
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
                    name="acceptPrivacyPolicy"
                    children={(field) => (
                        <field.Checkbox
                            label={
                                <div className="text-sm">
                                    <Translation>acceptPrivacyPolicy</Translation>{' '}
                                    <RouterLink to="/privacy-policy" className="underline">
                                        <Translation>privacyPolicy</Translation>
                                    </RouterLink>
                                </div>
                            }
                        />
                    )}
                />
                <Button type="submit" className="w-full">
                    <Translation>createAccount</Translation>
                </Button>
            </form>
            <GoogleOAuthButton />
            <div className="mt-4 text-center text-sm">
                <Translation>alreadyAccount</Translation>{' '}
                <RouterLink to="/login" className="underline">
                    <Translation>login</Translation>
                </RouterLink>
            </div>
        </div>
    );
}
