import { Label } from '@darts/ui/components/label';
import { useFieldContext } from '@darts/ui/form/useAppForm';
import { Translation } from '@darts/ui/i18n/Translation';

export default function Checkbox({ label }: { label: string | React.ReactNode }) {
    const field = useFieldContext<boolean>();

    return (
        <div className="flex items-center space-x-2">
            <input
                id={field.name}
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                onBlur={field.handleBlur}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                {typeof label === 'string' ? <Translation>{label}</Translation> : label}
            </Label>
        </div>
    );
}
