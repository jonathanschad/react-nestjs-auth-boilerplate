import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import ForgotPasswordSVG from '@/assets/illustrations/forgot-password.svg?react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initialPasswordForgotFormValues, passwordForgotFormValidationSchema } from '@/forms/password-forgot-form';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';
import { passwordForgot } from '@/repository/password';

export function PasswordForgot() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const passwordForgotMutatation = useMutation({
        mutationFn: passwordForgot,
        onSuccess: () => {
            // Invalidate and refetch

            queryClient.invalidateQueries();
            navigate('/password-forgot/success');
        },
    });

    const { t } = useTranslation('common');
    const formik = useFormik({
        initialValues: initialPasswordForgotFormValues,
        validationSchema: passwordForgotFormValidationSchema(t),
        onSubmit: (values) => {
            passwordForgotMutatation.mutate(values);
        },
    });

    return (
        <NotSignedInLayout illustration={<ForgotPasswordSVG className="w-1/2 max-w-full" />}>
            <div className="grid gap-2 text-center">
                <Translation element="h1">forgotPassword</Translation>
                <Translation element="p" as="mutedText">
                    forgotPasswordSubHeadline
                </Translation>
            </div>
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">
                        <Translation>email</Translation>
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        autoComplete="email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        errorMessage={formik.touched.email && formik.errors.email}
                    />
                </div>
                <Button type="submit" className="w-full">
                    <Translation>getPasswordLink</Translation>
                </Button>
            </form>
        </NotSignedInLayout>
    );
}
