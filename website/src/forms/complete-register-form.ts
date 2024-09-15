import { TFunction } from 'i18next';
import * as yup from 'yup';

export type CompleteRegisterFormValues = yup.Asserts<ReturnType<typeof completeRegisterFormValidationSchema>>;

export const completeRegisterFormValidationSchema = (t: TFunction) =>
    yup.object({
        password: yup.string().required(t('formik.passwordRequired')),
        name: yup.string().required(t('formik.nameRequired')),
    });

export const initialCompleteRegisterFormValues: CompleteRegisterFormValues = {
    password: '',
    name: '',
};
