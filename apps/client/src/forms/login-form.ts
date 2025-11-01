import { formOptions } from '@tanstack/react-form/nextjs';
import type { TFunction } from 'i18next';
import { z } from 'zod';

const createLoginFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email(t('formik.emailInvalid')).min(1, t('formik.emailRequired')),
        password: z.string().min(1, t('formik.passwordRequired')),
        remember: z.boolean(),
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;

const initialLoginFormValues: LoginFormValues = {
    email: '',
    password: '',
    remember: false,
};

export const loginFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialLoginFormValues,
        validators: {
            onSubmit: createLoginFormSchema(t),
        },
    });
