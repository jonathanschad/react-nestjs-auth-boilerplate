import { TFunction } from 'i18next';
import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createRegisterFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email(t('formik.emailInvalid')).min(1, t('formik.emailRequired')),
        acceptPrivacyPolicy: z.boolean().refine((val) => val === true, {
            message: t('formik.privacyPolicy'),
        }),
    });

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>;

const initialRegisterFormValues: RegisterFormValues = {
    email: '',
    acceptPrivacyPolicy: true,
};

export const registerFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialRegisterFormValues,
        validators: {
            onSubmit: createRegisterFormSchema(t),
        },
    });
