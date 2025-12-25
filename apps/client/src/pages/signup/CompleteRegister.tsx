import { Button } from '@boilerplate/ui/components/button';
import { useAppForm } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { completeRegistration } from '@/api/auth/useCompleteRegistration';
import RegisterSVG from '@/assets/illustrations/register.svg?react';
import { type CompleteRegisterFormValues, completeRegisterFormOptions } from '@/forms/complete-register-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { useStore } from '@/store/store';

const RegisterIllustration = <RegisterSVG className="m-16 w-full max-w-full" />;

export default function CompleteRegister() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const registeredEmail = useStore((state) => state.decodedAccessToken()?.email);
    const registerMutation = useMutation({
        mutationFn: completeRegistration,
        onSuccess: async () => {
            console.log('Registration complete');
            await queryClient.invalidateQueries();
            navigate('/');
        },
    });

    const handleSubmit = (data: CompleteRegisterFormValues) => {
        console.log(data);
        registerMutation.mutate(data);
    };
    const { t } = useTranslation('common');

    const form = useAppForm({
        ...completeRegisterFormOptions(t),
        onSubmit: ({ value }) => {
            handleSubmit(value);
        },
    });

    useSetNotSignedInLayoutIllustration(RegisterIllustration);
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <Translation element="h1">completeRegistration.completeRegistration</Translation>
                <Translation element="p" as="mutedText" translationParams={{ email: registeredEmail }}>
                    completeRegistration.registerCompleteSubHeadline
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
                    name="name"
                    children={(field) => (
                        <field.TextField
                            type="text"
                            autoComplete="given-name"
                            label={t('name')}
                            placeholder={t('namePlaceholder')}
                        />
                    )}
                />
                <form.AppField
                    name="password"
                    children={(field) => (
                        <field.TextField type="password" autoComplete="new-password" label={t('password')} />
                    )}
                />
                <Button type="submit" className="w-full">
                    <Translation>completeRegistration.completeRegistration</Translation>
                </Button>
            </form>
        </div>
    );
}
