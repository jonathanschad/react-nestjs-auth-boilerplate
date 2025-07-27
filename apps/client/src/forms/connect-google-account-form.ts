import { TFunction } from 'i18next';
import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createConnectGoogleAccountFormSchema = (t: TFunction) =>
    z.object({
        password: z.string().min(1, t('formik.passwordRequired')),
    });

export type ConnectGoogleAccountFormValues = z.infer<ReturnType<typeof createConnectGoogleAccountFormSchema>>;

const initialConnectGoogleAccountFormValues: ConnectGoogleAccountFormValues = {
    password: '',
};

export const connectGoogleAccountFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialConnectGoogleAccountFormValues,
        validators: {
            onSubmit: createConnectGoogleAccountFormSchema(t),
        },
    });
