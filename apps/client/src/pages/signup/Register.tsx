import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import RegisterSVG from '@client/assets/illustrations/register.svg?react';
import { GoogleOAuthButton } from '@client/components/google-oauth-button/GoogleOAuthButton';
import { Button } from '@client/components/ui/button';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { initialRegisterFormValues, registerFormValidationSchema, RegisterFormValues } from '@client/forms/register-form';
import { Translation } from '@client/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@client/layout/useSetNotSignedInLayoutIllustration';
import { register } from '@client/repository/login';

const RegisterIllustration = <RegisterSVG className="m-16 w-full max-w-full" />;

export default function Register() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const registerMutatation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            queryClient.invalidateQueries();
            navigate('/register/success');
        },
    });

    const handleSubmit = (data: RegisterFormValues) => {
        sessionStorage.setItem('registerEmail', data.email);
        sessionStorage.setItem('registerEmailSentAt', String(new Date().getTime()));
        console.log(data);
        registerMutatation.mutate(data);
    };
    const { t } = useTranslation('common');

    const formik = useFormik({
        initialValues: initialRegisterFormValues,
        validationSchema: registerFormValidationSchema(t),
        onSubmit: handleSubmit,
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
                <div className="mt-4 text-sm">
                    <Translation>acceptPrivacyPolicy</Translation>{' '}
                    <RouterLink to="/privacy-policy" className="underline">
                        <Translation>privacyPolicy</Translation>
                    </RouterLink>
                </div>
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
