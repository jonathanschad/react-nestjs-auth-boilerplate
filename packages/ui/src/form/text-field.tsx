import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from 'react';

import { Input } from '@boilerplate/ui/components/input';
import { Label } from '@boilerplate/ui/components/label';
import { useFieldContext } from '@boilerplate/ui/form/useAppForm';
import { Translation } from '@boilerplate/ui/i18n/Translation';

export default function TextField({
    label,
    type = 'text',
    placeholder,
    autoComplete,
}: {
    label: string | React.ReactNode;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
    autoComplete?: HTMLInputAutoCompleteAttribute;
}) {
    const field = useFieldContext<string>();

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{typeof label === 'string' ? <Translation>{label}</Translation> : label}</Label>
            <Input
                id={field.name}
                name={field.name}
                autoComplete={autoComplete}
                type={type}
                placeholder={placeholder}
                required
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={field.state.meta.isTouched && Boolean(field.state.meta.errors.length)}
                errorMessage={
                    field.state.meta.isTouched && field.state.meta.errors.length > 0
                        ? String(field.state.meta.errors[0])
                        : undefined
                }
            />
        </div>
    );
}
