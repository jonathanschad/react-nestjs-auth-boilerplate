import { Label } from '@darts/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@darts/ui/components/select';
import { useFieldContext } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';

export type SelectOption = {
    value: string;
    label: string;
};

export default function SelectField({
    label,
    placeholder,
    options,
}: {
    label: string | React.ReactNode;
    placeholder?: string;
    options: SelectOption[];
}) {
    const field = useFieldContext<string>();

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{typeof label === 'string' ? <Translation>{label}</Translation> : label}</Label>
            <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                <SelectTrigger id={field.name}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-500">{String(field.state.meta.errors[0])}</p>
            )}
        </div>
    );
}
