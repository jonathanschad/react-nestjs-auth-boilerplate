import { Card } from '@boilerplate/ui/components/card';
import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import { Trophy } from 'lucide-react';
import { UserTableCell } from '@/pages/ranking/UserTableCell';
import { StatCard } from './StatCard';

export const PlayerStatsSection = ({
    playerId,
    playerLabel,
    isWinner,
    statistics,
    eloChange,
    openSkillChange,
}: {
    playerId: string;
    playerLabel: string;
    isWinner: boolean;
    statistics?: {
        wonBullOff: boolean;
        averageScore: number;
        averageUntilFirstPossibleFinish: number;
        throwsOnDouble: number;
    };
    eloChange: number;
    openSkillChange: { mu: number; sigma: number };
}) => {
    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <UserTableCell userUuid={playerId} showName={true} avatarSize="lg" />
                    {isWinner && (
                        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 dark:bg-yellow-900">
                            <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <Typography as="smallText" className="font-semibold text-yellow-600 dark:text-yellow-400">
                                <Translation>winner</Translation>
                            </Typography>
                        </div>
                    )}
                </div>
                <Typography as="h3" className="text-muted-foreground">
                    <Translation>{playerLabel}</Translation>
                </Typography>
            </div>

            {/* Rating Changes */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-md border bg-muted/30 p-3">
                    <Typography as="smallText" className="mb-1 text-muted-foreground">
                        <Translation>eloChange</Translation>
                    </Typography>
                    <div className="flex items-baseline gap-2">
                        <Typography
                            as="h3"
                            className={`text-xl font-bold ${eloChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {eloChange >= 0 ? '+' : ''}
                            {eloChange.toFixed(1)}
                        </Typography>
                    </div>
                </div>
                <div className="rounded-md border bg-muted/30 p-3">
                    <Typography as="smallText" className="mb-1 text-muted-foreground">
                        <Translation>openSkillChange</Translation>
                    </Typography>
                    <div className="flex flex-col">
                        <Typography
                            as="smallText"
                            className={openSkillChange.mu >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                            μ: {openSkillChange.mu >= 0 ? '+' : ''}
                            {openSkillChange.mu.toFixed(2)}
                        </Typography>
                        <Typography
                            as="smallText"
                            className={openSkillChange.sigma >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                            σ: {openSkillChange.sigma >= 0 ? '+' : ''}
                            {openSkillChange.sigma.toFixed(2)}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Game Statistics */}
            {statistics && (
                <>
                    <Typography as="h4" className="mb-3 font-semibold">
                        <Translation>gameStatistics</Translation>
                    </Typography>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <StatCard label="averageScore" value={statistics.averageScore.toFixed(2)} />
                        <StatCard
                            label="averageUntilFirstPossibleFinish"
                            value={statistics.averageUntilFirstPossibleFinish.toFixed(2)}
                        />
                        <StatCard label="throwsOnDouble" value={statistics.throwsOnDouble} />
                        <div className="col-span-2 flex items-center gap-2 rounded-md border bg-card p-4 md:col-span-1">
                            <Typography as="mutedText" className="text-xs">
                                <Translation>wonBullOff</Translation>:
                            </Typography>
                            <Typography as="normalText" className="font-semibold">
                                {statistics.wonBullOff ? <Translation>yes</Translation> : <Translation>no</Translation>}
                            </Typography>
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};
