import { TFunction } from 'i18next';
import { z } from 'zod';
import { formOptions } from '@tanstack/react-form/nextjs';

const createProfileEditFormSchema = (t: TFunction) =>
    z.object({
        name: z.string().min(1, t('formik.nameRequired')),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
    }).refine((data) => {
        // If any password field is filled, all must be filled
        const hasPasswordField = data.currentPassword || data.newPassword || data.confirmPassword;
        if (hasPasswordField) {
            return data.currentPassword && data.newPassword && data.confirmPassword;
        }
        return true;
    }, {
        message: t('formik.passwordFieldsRequired'),
        path: ['currentPassword'],
    }).refine((data) => {
        // If password fields are filled, new password and confirm must match
        if (data.newPassword && data.confirmPassword) {
            return data.newPassword === data.confirmPassword;
        }
        return true;
    }, {
        message: t('formik.passwordsDoNotMatch'),
        path: ['confirmPassword'],
    }).refine((data) => {
        // New password must be different from current password
        if (data.currentPassword && data.newPassword) {
            return data.currentPassword !== data.newPassword;
        }
        return true;
    }, {
        message: t('formik.newPasswordMustBeDifferent'),
        path: ['newPassword'],
    });

export type ProfileEditFormValues = z.infer<ReturnType<typeof createProfileEditFormSchema>>;

export const createInitialProfileEditFormValues = (name: string = ''): ProfileEditFormValues => ({
    name,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});

export const profileEditFormOptions = (t: TFunction, initialValues: ProfileEditFormValues) =>
    formOptions({
        defaultValues: initialValues,
        validators: {
            onSubmit: createProfileEditFormSchema(t),
        },
    });