import { TFunction } from 'i18next';
import * as yup from 'yup';

export type ConnectGoogleAccountFormValues = yup.Asserts<ReturnType<typeof connectGoogleAccountFormValidationSchema>>;

export const connectGoogleAccountFormValidationSchema = (t: TFunction) =>
    yup.object({
        password: yup.string().required(t('formik.passwordRequired')),
    });

export const initialConnectGoogleAccountFormValues: ConnectGoogleAccountFormValues = {
    password: '',
};
