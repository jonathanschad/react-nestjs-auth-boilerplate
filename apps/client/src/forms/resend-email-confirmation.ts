import { formOptions } from '@tanstack/react-form/nextjs';
import type { TFunction } from 'i18next';
import { z } from 'zod';

const createResendEmailConfirmationFormSchema = (t: TFunction) =>
    z.object({
        email: z
            .string()
            .email(t('resendEmailConfirmation.emailInvalid'))
            .min(1, t('resendEmailConfirmation.emailRequired')),
    });

export type ResendEmailConfirmationFormValues = z.infer<ReturnType<typeof createResendEmailConfirmationFormSchema>>;

const initialResendEmailConfirmationFormValues: ResendEmailConfirmationFormValues = {
    email: '',
};

export const resendEmailConfirmationFormOptions = (t: TFunction) =>
    formOptions({
        defaultValues: initialResendEmailConfirmationFormValues,
        validators: {
            onSubmit: createResendEmailConfirmationFormSchema(t),
        },
    });
