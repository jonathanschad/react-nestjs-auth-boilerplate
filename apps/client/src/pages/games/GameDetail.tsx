import type { GameEntityApiDTO, GameTurnEntityApiDTO } from '@darts/types';
import { Button } from '@darts/ui/components/button';
import { Card } from '@darts/ui/components/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@darts/ui/components/table';
import { Typography } from '@darts/ui/components/typography';
import { Translation } from '@darts/ui/i18n/Translation';
import dayjs from 'dayjs';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetGame } from '@/api/dart/game/useGetGame';
import { UserTableCell } from '@/pages/ranking/UserTableCell';

const StatCard = ({ label, value }: { label: string; value: string | number }) => {
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

const PlayerStatsSection = ({
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

const formatThrow = ({ value, multiplier }: { value: number | null; multiplier: number | null }) => {
    if (value === null || multiplier === null) return '-';
    if (value === 0) return 'Miss';
    const multiplierStr = multiplier === 1 ? '' : multiplier === 2 ? 'D' : 'T';
    return `${multiplierStr}${value}`;
};

const TurnRow = ({ turn, turnNumber }: { turn: GameTurnEntityApiDTO; turnNumber: number }) => {
    const throw1 = formatThrow({ value: turn.throw1, multiplier: turn.throw1Multiplier });
    const throw2 = formatThrow({ value: turn.throw2, multiplier: turn.throw2Multiplier });
    const throw3 = formatThrow({ value: turn.throw3, multiplier: turn.throw3Multiplier });

    return (
        <TableRow>
            <TableCell>
                <Typography as="normalText">{turnNumber}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">{throw1}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">{throw2}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText">{throw3}</Typography>
            </TableCell>
            <TableCell>
                <Typography as="normalText" className="font-semibold">
                    {turn.totalScore}
                </Typography>
            </TableCell>
        </TableRow>
    );
};

const TurnsTable = ({ turns, playerId }: { turns: GameTurnEntityApiDTO[]; playerId: string }) => {
    const playerTurns = turns.filter((turn) => turn.playerId === playerId).sort((a, b) => a.turnNumber - b.turnNumber);

    return (
        <div className="overflow-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Translation>turn</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw1</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw2</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>throw3</Translation>
                        </TableHead>
                        <TableHead>
                            <Translation>totalScore</Translation>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {playerTurns.map((turn) => (
                        <TurnRow key={turn.id} turn={turn} turnNumber={turn.turnNumber + 1} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

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

    // Combine and sort all turns chronologically
    const allTurns = [...game.playerA.turns, ...game.playerB.turns].sort((a, b) => a.turnNumber - b.turnNumber);

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

            {/* Turn-by-turn breakdown */}
            <Card className="p-6">
                <Typography as="h2" className="mb-4">
                    <Translation>turnByTurn</Translation>
                </Typography>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <Typography as="h3" className="mb-3">
                            <Translation>playerA</Translation>
                        </Typography>
                        <TurnsTable turns={allTurns} playerId={game.playerA.id} />
                    </div>
                    <div>
                        <Typography as="h3" className="mb-3">
                            <Translation>playerB</Translation>
                        </Typography>
                        <TurnsTable turns={allTurns} playerId={game.playerB.id} />
                    </div>
                </div>
            </Card>
        </div>
    );
};
