import { Button } from '@darts/ui/components/button';
import { useAppForm } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import ForgotPasswordSVG from '@/assets/illustrations/forgot-password.svg?react';
import { passwordForgotFormOptions } from '@/forms/password-forgot-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { passwordForgot } from '@/repository/password';

const PasswordForgotIllustration = <ForgotPasswordSVG className="w-1/2 max-w-full" />;

export function PasswordForgot() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const passwordForgotMutation = useMutation({
        mutationFn: passwordForgot,
        onSuccess: async () => {
            // Invalidate and refetch
            await queryClient.invalidateQueries();
            navigate('/password-forgot/success');
        },
    });

    const { t } = useTranslation('common');

    const form = useAppForm({
        ...passwordForgotFormOptions(t),
        onSubmit: ({ value }) => {
            passwordForgotMutation.mutate(value);
        },
    });

    useSetNotSignedInLayoutIllustration(PasswordForgotIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1">forgotPassword</Translation>
                <Translation element="p" as="mutedText">
                    forgotPasswordSubHeadline
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
                <Button type="submit" className="w-full">
                    <Translation>getPasswordLink</Translation>
                </Button>
            </form>
        </div>
    );
}
