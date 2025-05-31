import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '@boilerplate/ui/components/button';
import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { Translation } from '@boilerplate/ui/i18n/Translation';

import RegisterSVG from '@/assets/illustrations/register.svg?react';
import {
    completeRegisterFormValidationSchema,
    CompleteRegisterFormValues,
    initialCompleteRegisterFormValues,
} from '@/forms/complete-register-form';
import { useSetNotSignedInLayoutIllustration } from '@/layout/useSetNotSignedInLayoutIllustration';
import { completeRegistration } from '@/repository/login';
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

    const formik = useFormik({
        initialValues: initialCompleteRegisterFormValues,
        validationSchema: completeRegisterFormValidationSchema(t),
        onSubmit: handleSubmit,
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
                <Button type="submit" className="w-full">
                    <Translation>completeRegistration.completeRegistration</Translation>
                </Button>
            </form>
        </div>
    );
}
