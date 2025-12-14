import { PlayerOfTheWeekEntityDTO } from '@darts/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@darts/ui/components/card';
import { Translation } from '@darts/ui/i18n/Translation';
import { TrendingUp } from 'lucide-react';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

interface CurrentLeaderCardProps {
    topContender: PlayerOfTheWeekEntityDTO;
}

export const CurrentLeaderCard = ({ topContender }: CurrentLeaderCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <Translation>currentLeader</Translation>
                </CardTitle>
                <CardDescription>
                    <Translation>currentWeekLeader</Translation>
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
