import { Badge } from '@darts/ui/components/badge';
import { Card } from '@darts/ui/components/card';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import { Medal, Trophy } from 'lucide-react';

type RatingDisplayProps = {
    rating: string;
    rank: number | null;
    type: 'elo' | 'openskill';
};
export const RatingDisplay = ({ rating, rank, type }: RatingDisplayProps) => {
    let translationKey = '';
    let trophyColor = '';
    switch (type) {
        case 'elo':
            translationKey = 'elo';
            trophyColor = 'text-amber-600';
            break;
        case 'openskill':
            translationKey = 'openskill';
            trophyColor = 'text-blue-600';
            break;
    }

    return (
        <Card className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-all hover:shadow-md hover:border-foreground/20">
            <Trophy className={`hidden h-4 w-4 sm:block ${trophyColor}`} />
            <div className="flex flex-col gap-0.5">
                <Translation as="xSmallMutedText">{translationKey}</Translation>
                <div className="flex items-center gap-1.5">
                    <Typography as="smallText" className="whitespace-nowrap">
                        {rating}
                    </Typography>
                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                        <Medal className="hidden mr-0.5 h-3 w-3 sm:block" />#{rank ?? '-'}
                    </Badge>
                </div>
            </div>
        </Card>
    );
};
