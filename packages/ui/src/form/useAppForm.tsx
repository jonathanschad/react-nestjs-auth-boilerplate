import { lazy } from 'react';
import { createFormHook } from '@tanstack/react-form';
import { createFormHookContexts } from '@tanstack/react-form';

const TextField = lazy(() => import('@boilerplate/ui/form/text-field'));
const Checkbox = lazy(() => import('@boilerplate/ui/form/checkbox'));

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
