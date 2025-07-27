import { TFunction } from 'i18next';
import { z } from 'zod';

export const createLoginFormSchema = (t: TFunction) =>
    z.object({
        email: z.string().email(t('formik.emailInvalid')).min(1, t('formik.emailRequired')),
        password: z.string().min(1, t('formik.passwordRequired')),
        remember: z.boolean(),
    });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;

export const initialLoginFormValues: LoginFormValues = {
    email: '',
    password: '',
    remember: false,
};
