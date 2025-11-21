import { formOptions } from '@tanstack/react-form/nextjs';
import type { TFunction } from 'i18next';
import { z } from 'zod';

const createPasswordResetFormSchema = (t: TFunction) =>
    z
        .object({
            password: z.string().min(1, t('formik.passwordRequired')),
            passwordRepeat: z.string().min(1, t('formik.passwordRequired')),
        })
        .refine((data) => data.password === data.passwordRepeat, {
            message: t('formik.passwordsMustMatch'),
            path: ['passwordRepeat'],
        });

export type PasswordResetFormValues = z.infer<ReturnType<typeof createPasswordResetFormSchema>>;

const initialPasswordResetFormValues: PasswordResetFormValues = {
    password: '',
    passwordRepeat: '',
};

export const passwordResetFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialPasswordResetFormValues,
        validators: {
            onSubmit: createPasswordResetFormSchema(t),
        },
    });
