import { PlayerOfTheWeekEntityDTO } from '@boilerplate/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@boilerplate/ui/components/card';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import dayjs from 'dayjs';
import { Calendar, TrendingUp, Trophy } from 'lucide-react';
import { formatWeek } from '@/pages/player/player-of-the-week/utils';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

interface PlayerOfTheWeekCardProps {
    topContender: PlayerOfTheWeekEntityDTO;
    type: 'current-leader' | 'winner';
}

export const PlayerOfTheWeekCard = ({ topContender, type }: PlayerOfTheWeekCardProps) => {
    const weekStart = dayjs(topContender.weekStart).toDate();
    const weekEnd = dayjs(weekStart).endOf('week').toDate();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {type === 'current-leader' ? (
                        <>
                            <TrendingUp className="h-6 w-6 text-primary" />
                            <Translation>currentLeader</Translation>
                        </>
                    ) : (
                        <>
                            <Trophy className="h-8 w-8 text-yellow-500" />
                            <Translation>winner</Translation>
                        </>
                    )}
                </CardTitle>
                <CardDescription>
                    {type === 'current-leader' ? (
                        <Translation>currentWeekLeader</Translation>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatWeek(weekStart)}</span>
                                <span>•</span>
                                <span>
                                    {dayjs(weekStart).format('DD.MM.YYYY')} - {dayjs(weekEnd).format('DD.MM.YYYY')}
                                </span>
                            </div>
                        </>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>player</Translation>
                    </div>
                    <div className="text-xl font-semibold">
                        <UserTableCell userUuid={topContender.playerId} />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>eloDifference</Translation>
                    </div>
                    <div
                        className={`text-xl font-semibold ${topContender.eloDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                        {topContender.eloDifference >= 0 ? '+' : ''}
                        {topContender.eloDifference.toFixed(1)}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>openSkillDifference</Translation>
                    </div>
                    <div
                        className={`text-xl font-semibold ${topContender.openSkillDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                        {topContender.openSkillDifference >= 0 ? '+' : ''}
                        {topContender.openSkillDifference.toFixed(1)}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>averageScore</Translation>
                    </div>
                    <div className="text-xl font-semibold">{topContender.averageScore.toFixed(1)}</div>
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>scoringAverage</Translation>
                    </div>
                    <div className="text-xl font-semibold">{topContender.scoringAverage.toFixed(1)}</div>
                </div>
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                        <Translation>gamesPlayed</Translation>
                    </div>
                    <div className="text-xl font-semibold">{topContender.numberOfGames}</div>
                </div>
            </CardContent>
        </Card>
    );
};
