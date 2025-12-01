import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { lazy } from 'react';

const TextField = lazy(() => import('@darts/ui/form/text-field'));
const Checkbox = lazy(() => import('@darts/ui/form/checkbox'));
const SelectField = lazy(() => import('@darts/ui/form/select-field'));

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldComponents: {
        TextField,
        Checkbox,
        SelectField,
    },
    formComponents: {},
    fieldContext,
    formContext,
});
