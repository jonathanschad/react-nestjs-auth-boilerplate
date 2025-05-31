import { useFormik } from 'formik';
import { AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Alert, AlertDescription } from '@boilerplate/ui/components/alert';
import { Button } from '@boilerplate/ui/components/button';
import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { Translation } from '@boilerplate/ui/i18n/Translation';

import ResetPasswordSVG from '@/assets/illustrations/reset-password.svg?react';
import { initialPasswordResetFormValues, passwordResetFormValidationSchema } from '@/forms/password-reset';
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
    const formik = useFormik({
        initialValues: initialPasswordResetFormValues,
        validationSchema: passwordResetFormValidationSchema(t),
        onSubmit: (values) => {
            passwordChangeMutation.mutate({ ...values, token: token as string });
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
                    <form onSubmit={formik.handleSubmit} className="grid gap-4">
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
                                autoComplete="new-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                errorMessage={formik.touched.password && formik.errors.password}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">
                                    <Translation>passwordRepeat</Translation>
                                </Label>
                            </div>
                            <Input
                                id="passwordRepeat"
                                type="password"
                                required
                                name="passwordRepeat"
                                autoComplete="new-password"
                                value={formik.values.passwordRepeat}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.passwordRepeat && Boolean(formik.errors.passwordRepeat)}
                                errorMessage={formik.touched.passwordRepeat && formik.errors.passwordRepeat}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!isPasswordResetTokenValid}>
                            <Translation>passwordReset</Translation>
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
