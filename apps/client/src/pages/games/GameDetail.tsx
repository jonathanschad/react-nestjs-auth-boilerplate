import { Button } from '@boilerplate/ui/components/button';
import { Card } from '@boilerplate/ui/components/card';
import { Typography } from '@boilerplate/ui/components/typography';
import { Translation } from '@boilerplate/ui/i18n/Translation';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetGame } from '@/api/dart/game/useGetGame';
import { PlayerStatsSection } from './components/PlayerStatsSection';
import { StatCard } from './components/StatCard';
import { VisitsTable } from './components/VisitsTable';

export const GameDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetGame(id);

    if (isLoading) {
        return (
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
                <Card className="p-6">
                    <Typography as="h2" className="mb-4">
                        <Translation>loading</Translation>
                    </Typography>
                </Card>
            </div>
        );
    }

    if (error || !data || !id) {
        return (
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
                <Card className="p-6">
                    <Typography as="h2" className="mb-4">
                        <Translation>gameNotFound</Translation>
                    </Typography>
                    <Button onClick={() => navigate('/games')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <Translation>backToGames</Translation>
                    </Button>
                </Card>
            </div>
        );
    }

    const game = data;
    const duration = dayjs(game.gameEnd).diff(dayjs(game.gameStart), 'minute');
    const eloChangeA = game.playerA.eloHistory.eloAfter - game.playerA.eloHistory.eloBefore;
    const eloChangeB = game.playerB.eloHistory.eloAfter - game.playerB.eloHistory.eloBefore;
    const openSkillChangeA = {
        mu: game.playerA.openSkillHistory.muAfter - game.playerA.openSkillHistory.muBefore,
        sigma: game.playerA.openSkillHistory.sigmaAfter - game.playerA.openSkillHistory.sigmaBefore,
    };
    const openSkillChangeB = {
        mu: game.playerB.openSkillHistory.muAfter - game.playerB.openSkillHistory.muBefore,
        sigma: game.playerB.openSkillHistory.sigmaAfter - game.playerB.openSkillHistory.sigmaBefore,
    };

    // Combine and sort all visits chronologically
    const allVisits = [...game.playerA.visits, ...game.playerB.visits].sort((a, b) => a.visitNumber - b.visitNumber);

    return (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigate('/games')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <Translation>backToGames</Translation>
                </Button>
            </div>

            {/* Game Overview */}
            <Card className="p-6">
                <Typography as="h1" className="mb-4">
                    <Translation>gameDetails</Translation>
                </Typography>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard label="date" value={dayjs(game.gameEnd).format('DD.MM.YYYY')} />
                    <StatCard label="time" value={dayjs(game.gameEnd).format('HH:mm')} />
                    <StatCard label="duration" value={`${duration} min`} />
                    <StatCard label="gameType" value={game.type} />
                    <StatCard label="checkoutMode" value={game.checkoutMode} />
                </div>
            </Card>

            {/* Player A Stats */}
            <PlayerStatsSection
                playerId={game.playerA.id}
                playerLabel="playerA"
                isWinner={game.winnerId === game.playerA.id}
                statistics={game.playerA.gameStatistics}
                eloChange={eloChangeA}
                openSkillChange={openSkillChangeA}
            />

            {/* Player B Stats */}
            <PlayerStatsSection
                playerId={game.playerB.id}
                playerLabel="playerB"
                isWinner={game.winnerId === game.playerB.id}
                statistics={game.playerB.gameStatistics}
                eloChange={eloChangeB}
                openSkillChange={openSkillChangeB}
            />

            {/* Visit-by-visit breakdown */}
            <Card className="p-6">
                <Typography as="h2" className="mb-4">
                    <Translation>visitByVisit</Translation>
                </Typography>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <Typography as="h3" className="mb-3">
                            <Translation>playerA</Translation>
                        </Typography>
                        <VisitsTable visits={allVisits} playerId={game.playerA.id} winnerId={game.winnerId} />
                    </div>
                    <div>
                        <Typography as="h3" className="mb-3">
                            <Translation>playerB</Translation>
                        </Typography>
                        <VisitsTable visits={allVisits} playerId={game.playerB.id} winnerId={game.winnerId} />
                    </div>
                </div>
            </Card>
        </div>
    );
};
