import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import { Button } from '@/components/ui/button';
import { CheckboxInput } from '@/components/ui/checkbox-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initialRegisterFormValues, registerFormValidationSchema, RegisterFormValues } from '@/forms/register-form';
import { Translation } from '@/i18n/Translation';
import { NotSignedInLayout } from '@/layout/NotSignedInLayout';
import { register, startGoogleOAuthFlow } from '@/repository/login';

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
    const googleOAuthMutatation = useMutation({
        mutationFn: startGoogleOAuthFlow,
        onSuccess: () => {
            queryClient.invalidateQueries();
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

    return (
        <NotSignedInLayout illustration={<RegisterSVG className="m-16 w-full max-w-full" />}>
            <div className="grid gap-2 text-center">
                <Translation element="h1">register</Translation>
                <Translation element="p" as="mutedText">
                    registerSubHeadline
                </Translation>
            </div>
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">
                        <Translation>name</Translation>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        autoComplete="given-name"
                        type="name"
                        placeholder={t('namePlaceholder')}
                        required
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        errorMessage={formik.touched.name && formik.errors.name}
                    />
                </div>
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
                <div className="">
                    <CheckboxInput
                        id="acceptAgb"
                        name="acceptAgb"
                        checked={formik.values.acceptAgb}
                        onCheckedChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label={<Translation>acceptAgb</Translation>}
                        error={formik.touched.acceptAgb && Boolean(formik.errors.acceptAgb)}
                        errorMessage={formik.touched.acceptAgb && formik.errors.acceptAgb}
                    />
                </div>
                <Button type="submit" className="w-full">
                    <Translation>createAccount</Translation>
                </Button>
            </form>
            <Button className="w-full" onClick={() => googleOAuthMutatation.mutate()}>
                <Translation>signInWithGoogle</Translation>
            </Button>
            <div className="mt-4 text-center text-sm">
                <Translation>alreadyAccount</Translation>{' '}
                <RouterLink to="/login" className="underline">
                    <Translation>login</Translation>
                </RouterLink>
            </div>
        </NotSignedInLayout>
    );
}
