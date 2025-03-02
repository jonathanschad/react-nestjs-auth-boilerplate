import { TFunction } from 'i18next';
import * as yup from 'yup';

export type LoginFormValues = yup.Asserts<ReturnType<typeof loginFormValidationSchema>>;

export const loginFormValidationSchema = (t: TFunction) =>
    yup.object({
        email: yup.string().email(t('formik.emailInvalid')).required(t('formik.emailRequired')),
        password: yup.string().required(t('formik.passwordRequired')),
        remember: yup.boolean().required(t('formik.rememberMeRequired')),
    });

export const initialLoginFormValues: LoginFormValues = {
    email: '',
    password: '',
    remember: false,
};
