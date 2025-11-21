import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { lazy } from 'react';

const TextField = lazy(() => import('@darts/ui/form/text-field'));
const Checkbox = lazy(() => import('@darts/ui/form/checkbox'));

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        Checkbox,
    },
    formComponents: {},
    fieldContext,
    formContext,
});
