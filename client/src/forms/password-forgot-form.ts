import { TFunction } from 'i18next';
import * as yup from 'yup';

export type PasswordForgotFormValues = yup.Asserts<ReturnType<typeof passwordForgotFormValidationSchema>>;

export const passwordForgotFormValidationSchema = (t: TFunction) =>
    yup.object({
        email: yup.string().email(t('formik.emailInvalid')).required(t('formik.emailRequired')),
    });

export const initialPasswordForgotFormValues: PasswordForgotFormValues = {
    email: '',
};
