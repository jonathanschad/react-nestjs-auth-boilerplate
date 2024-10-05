import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';

import LoginSVG from '@/assets/illustrations/login.svg?react';
import { GoogleOAuthButton } from '@/components/google-oauth-button/GoogleOAuthButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initialLoginFormValues, loginFormValidationSchema } from '@/forms/login-form';
import { Translation } from '@/i18n/Translation';
import { useSetNotSignedInLayoutIllustration } from '@/layout/NotSignedInLayout';
import { login } from '@/repository/login';

const LoginIllustration = <LoginSVG className="m-8 w-full max-w-full" />;

export function Login() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            // Invalidate and refetch
            navigate('/');

            queryClient.invalidateQueries();
        },
    });

    const { t } = useTranslation('common');
    const formik = useFormik({
        initialValues: initialLoginFormValues,
        validationSchema: loginFormValidationSchema(t),
        onSubmit: (values) => {
            loginMutation.mutate(values);
        },
    });

    useSetNotSignedInLayoutIllustration(LoginIllustration);
    return (
        <>
            <Outlet context={{ illustration: <LoginSVG className="m-8 w-full max-w-full" /> }} />
            <div className="grid gap-2 text-center">
                <Translation element="h1">login</Translation>
                <Translation element="p" as="mutedText">
                    loginSubHeadline
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
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">
                            <Translation>password</Translation>
                        </Label>
                        <RouterLink to="/password-forgot" className="ml-auto inline-block text-sm underline">
                            <Translation>forgotPassword</Translation>
                        </RouterLink>
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
        </>
    );
}
