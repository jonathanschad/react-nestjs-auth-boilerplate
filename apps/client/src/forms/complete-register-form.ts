import { TFunction } from 'i18next';
import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createCompleteRegisterFormSchema = (t: TFunction) =>
    z.object({
        password: z.string().min(1, t('formik.passwordRequired')),
        name: z.string().min(1, t('formik.nameRequired')),
    });

export type CompleteRegisterFormValues = z.infer<ReturnType<typeof createCompleteRegisterFormSchema>>;

const initialCompleteRegisterFormValues: CompleteRegisterFormValues = {
    password: '',
    name: '',
};

export const completeRegisterFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialCompleteRegisterFormValues,
        validators: {
            onSubmit: createCompleteRegisterFormSchema(t),
        },
    });
