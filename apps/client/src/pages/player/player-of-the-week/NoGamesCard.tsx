import { Card, CardDescription, CardHeader, CardTitle } from '@boilerplate/ui/components/card';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Calendar } from 'lucide-react';

export const NoGamesCard = () => {
    return (
        <Card className="border-muted">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                    <Translation>noGamesThisWeek</Translation>
                </CardTitle>
                <CardDescription>
                    <Translation>noGamesThisWeekDescription</Translation>
                </CardDescription>
            </CardHeader>
        </Card>
    );
};
