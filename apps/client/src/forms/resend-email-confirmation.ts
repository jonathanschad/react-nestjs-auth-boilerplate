import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createResendEmailConfirmationFormSchema = () =>
    z.object({
        email: z.string().email('Enter a valid email').min(1, 'Email is required'),
    });

export type ResendEmailConfirmationFormValues = z.infer<ReturnType<typeof createResendEmailConfirmationFormSchema>>;

const initialResendEmailConfirmationFormValues: ResendEmailConfirmationFormValues = {
    email: '',
};

export const resendEmailConfirmationFormOptions = () =>
    formOptions({
        defaultValues: initialResendEmailConfirmationFormValues,
        validators: {
            onSubmit: createResendEmailConfirmationFormSchema(),
        },
    });
