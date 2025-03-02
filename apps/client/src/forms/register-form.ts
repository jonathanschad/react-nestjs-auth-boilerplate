import { TFunction } from 'i18next';
import * as yup from 'yup';

export type RegisterFormValues = yup.Asserts<ReturnType<typeof registerFormValidationSchema>>;

export const registerFormValidationSchema = (t: TFunction) =>
    yup.object({
        email: yup.string().email(t('formik.emailInvalid')).required(t('formik.emailRequired')),
        acceptPrivacyPolicy: yup.boolean().oneOf([true], t('formik.privacyPolicy')).required(),
    });

export const initialRegisterFormValues: RegisterFormValues = {
    email: '',
    acceptPrivacyPolicy: true,
};
