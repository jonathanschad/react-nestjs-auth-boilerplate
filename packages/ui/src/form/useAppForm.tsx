import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { lazy } from 'react';

const TextField = lazy(() => import('@boilerplate/ui/form/text-field'));
const Checkbox = lazy(() => import('@boilerplate/ui/form/checkbox'));
const SelectField = lazy(() => import('@boilerplate/ui/form/select-field'));

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
