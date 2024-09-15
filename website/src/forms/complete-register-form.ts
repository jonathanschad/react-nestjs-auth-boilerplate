import { TFunction } from 'i18next';
import * as yup from 'yup';

export type RegisterFormValues = yup.Asserts<ReturnType<typeof registerFormValidationSchema>>;

export const registerFormValidationSchema = (t: TFunction) =>
    yup.object({
        email: yup.string().email(t('formik.emailInvalid')).required(t('formik.emailRequired')),
        password: yup.string().required(t('formik.passwordRequired')),
        name: yup.string().required(t('formik.nameRequired')),
        acceptAgb: yup.boolean().oneOf([true], t('formik.termsAndConditions')).required(),
    });

export const initialRegisterFormValues: RegisterFormValues = {
    email: '',
    password: '',
    name: '',
    acceptAgb: false,
};
