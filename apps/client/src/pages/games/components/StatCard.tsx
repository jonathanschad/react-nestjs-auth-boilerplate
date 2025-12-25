import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';

export const StatCard = ({ label, value }: { label: string; value: string | number }) => {
    return (
        <div className="flex flex-col gap-1 rounded-md border bg-card p-4">
            <Typography as="mutedText" className="text-xs">
                <Translation>{label}</Translation>
            </Typography>
            <Typography as="h3" className="text-2xl font-bold">
                {value}
            </Typography>
        </div>
    );
};
