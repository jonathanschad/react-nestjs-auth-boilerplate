import { TFunction } from 'i18next';
import * as yup from 'yup';

export type PasswordResetFormValues = yup.Asserts<ReturnType<typeof passwordResetFormValidationSchema>>;

export const passwordResetFormValidationSchema = (t: TFunction) =>
    yup.object({
        password: yup.string().required(t('formik.passwordRequired')),
        passwordRepeat: yup
            .string()
            .required(t('formik.passwordRequired'))
            .oneOf([yup.ref('password')], t('formik.passwordsMustMatch')),
    });

export const initialPasswordResetFormValues: PasswordResetFormValues = {
    password: '',
    passwordRepeat: '',
};
