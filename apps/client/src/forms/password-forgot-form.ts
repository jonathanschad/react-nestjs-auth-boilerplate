import { TFunction } from 'i18next';
import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createPasswordForgotFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email(t('formik.emailInvalid')).min(1, t('formik.emailRequired')),
    });

export type PasswordForgotFormValues = z.infer<ReturnType<typeof createPasswordForgotFormSchema>>;

const initialPasswordForgotFormValues: PasswordForgotFormValues = {
    email: '',
};

export const passwordForgotFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialPasswordForgotFormValues,
        validators: {
            onSubmit: createPasswordForgotFormSchema(t),
        },
    });
