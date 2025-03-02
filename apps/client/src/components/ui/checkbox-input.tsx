import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import { Checkbox, CheckboxProps } from '@client/components/ui/checkbox';

export interface CheckboxInputProps extends CheckboxProps {
    error?: boolean;
    errorMessage?: React.ReactNode;
    label?: React.ReactNode;
}

const CheckboxInput = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxInputProps>(
    ({ error, errorMessage, label, id, ...props }, ref) => (
        <>
            <div className="flex items-center space-x-2">
                <Checkbox ref={ref} {...props} id={id} />
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
            </div>
            {error ? <p className="mt-2 text-sm font-medium text-destructive">{errorMessage}</p> : <></>}
        </>
    ),
);
CheckboxInput.displayName = CheckboxPrimitive.Root.displayName;

export { CheckboxInput };
