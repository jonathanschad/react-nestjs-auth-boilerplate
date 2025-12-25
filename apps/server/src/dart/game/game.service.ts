import { GameStatisticsIndividual, GameVisit, GameVisitOutcome, Prisma } from '@boilerplate/prisma';
import type {
    CreateGameDTO,
    EloRating,
    GameEntityApiDTO,
    GameFilter,
    GamePreviewResponseDTO,
    Pagination,
} from '@boilerplate/types';

import { Injectable } from '@nestjs/common';
import { DEFAULT_ELO, EloService } from '@/dart/ranking/elo.service';
import { GameResult } from '@/dart/ranking/ranking';
import { RankingService } from '@/dart/ranking/ranking.service';
import { RankingHistoryService } from '@/dart/ranking/ranking-history.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseGameStatisticService } from '@/database/game/game-statistic.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';
import { SlackService } from '@/slack/slack.service';
import { getGameTypeFromScore, getPointsForGameType, getPossibleFinishes } from '@/util/darts';

type GameHistory = {
    pointsScored: number;
    visitNumber: number;
    scoreBeforeThrow: number;
    scoreAfterThrow: number;
};

type GameStatisticsSummary = Omit<
    GameStatisticsIndividual,
    'id' | 'createdAt' | 'updatedAt' | 'gameId' | 'playerId' | 'wonBullOff'
> & {
    numberOfGames: number;
};

@Injectable()
export class GameService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseGameStatisticService: DatabaseGameStatisticService,
        private readonly eloService: EloService,
        private readonly rankingHistoryService: RankingHistoryService,
        private readonly rankingService: RankingService,
        private readonly slackService: SlackService,
    ) {}

    async createGame(uuid: string, createGameDto: CreateGameDTO, sendSlackNotification: boolean = false) {
        uuid = uuid.toLowerCase();

        const playerA = await this.databaseUserService.findByUuid(createGameDto.playerAId);
        const playerB = await this.databaseUserService.findByUuid(createGameDto.playerBId);

        const playerARankingBefore = await this.rankingService.getCachedEloRanking(playerA.id);
        const playerBRankingBefore = await this.rankingService.getCachedEloRanking(playerB.id);

        const loser = createGameDto.winnerId === playerA.id ? playerB : playerA;

        createGameDto.visits.sort((a, b) => a.visitNumber - b.visitNumber);
        const firstVisit = createGameDto.visits[0];

        // Calculate scores and outcomes for each visit
        const startingScore = getPointsForGameType(createGameDto.type);
        const playerScores = new Map<string, number>([
            [playerA.id, startingScore],
            [playerB.id, startingScore],
        ]);

        const visitsWithCalculations = createGameDto.visits.map((visit, index): Prisma.GameVisitCreateManyGameInput => {
            const currentScore = playerScores.get(visit.playerId) ?? startingScore;
            const totalScored =
                (visit.throw1 ?? 0) * (visit.throw1Multiplier ?? 1) +
                (visit.throw2 ?? 0) * (visit.throw2Multiplier ?? 1) +
                (visit.throw3 ?? 0) * (visit.throw3Multiplier ?? 1);

            const newScore = currentScore - totalScored;
            let outcome: GameVisitOutcome;

            if (newScore < 0 || (createGameDto.checkoutMode !== 'SINGLE_OUT' && newScore === 1)) {
                outcome = GameVisitOutcome.BUSTED;
                // Score remains the same on bust
            } else if (totalScored === 0) {
                outcome = GameVisitOutcome.MISS;
            } else {
                playerScores.set(visit.playerId, newScore);
                outcome = GameVisitOutcome.HIT;
            }

            return {
                playerId: visit.playerId,
                visitNumber: index,
                throw1: visit.throw1,
                throw1Multiplier: visit.throw1Multiplier,
                throw2: visit.throw2,
                throw2Multiplier: visit.throw2Multiplier,
                throw3: visit.throw3,
                throw3Multiplier: visit.throw3Multiplier,
                totalScored,
                remainingScoreBefore: currentScore,
                remainingScoreAfter: outcome === GameVisitOutcome.HIT ? newScore : currentScore,
                outcome,
            };
        });

        const game = await this.databaseGameService.createGame({
            id: uuid,
            playerAId: playerA.id,
            playerBId: playerB.id,
            gameStart: createGameDto.gameStart,
            gameEnd: createGameDto.gameEnd,
            winnerId: createGameDto.winnerId,
            loserId: loser.id,
            bullOffWinnerId: firstVisit?.playerId,
            type: createGameDto.type,
            checkoutMode: createGameDto.checkoutMode,
            visits: {
                createMany: {
                    data: visitsWithCalculations,
                },
            },
        });

        await this.upsertGameStatistics(game.id);

        await this.rankingHistoryService.calculateNewRankings(game);

        await this.rankingService.updateCachedRankings();

        const playerARankingAfter = await this.rankingService.getCachedEloRanking(playerA.id);
        const playerBRankingAfter = await this.rankingService.getCachedEloRanking(playerB.id);

        if (sendSlackNotification) {
            await this.slackService.sendNewGameNotification({
                playerA: {
                    name: playerA.name ?? '',
                    ratingBefore: playerARankingBefore.rank,
                    ratingAfter: playerARankingAfter.rank,
                },
                playerB: {
                    name: playerB.name ?? '',
                    ratingBefore: playerBRankingBefore.rank,
                    ratingAfter: playerBRankingAfter.rank,
                },
                result: game.winnerId === playerA.id ? GameResult.WIN_PLAYER_A : GameResult.WIN_PLAYER_B,
            });
        }

        return;
    }

    private async upsertGameStatistics(gameId: string) {
        const game = await this.databaseGameService.getGameWithVisitsById(gameId);

        const playerAVisits = game.visits.filter((visit) => visit.playerId === game.playerAId);
        const playerBVisits = game.visits.filter((visit) => visit.playerId === game.playerBId);

        if (playerAVisits.length > 0) {
            await this.databaseGameStatisticService.upsertGameStatistics({
                gameId: game.id,
                playerId: game.playerAId,
                averageScore: this.getAverageScore(playerAVisits),
                averageUntilFirstPossibleFinish: this.getAverageUntil60Points(playerAVisits),
                throwsOnDouble: this.getThrowsOnDouble(playerAVisits),
                wonBullOff: game.visits[0].playerId === game.playerAId,
            });
        }

        if (playerBVisits.length > 0) {
            await this.databaseGameStatisticService.upsertGameStatistics({
                gameId: game.id,
                playerId: game.playerBId,
                averageScore: this.getAverageScore(playerBVisits),
                averageUntilFirstPossibleFinish: this.getAverageUntil60Points(playerBVisits),
                throwsOnDouble: this.getThrowsOnDouble(playerBVisits),
                wonBullOff: game.visits[0].playerId === game.playerBId,
            });
        }
    }

    public async recalculateAllGameStatistics() {
        const games = await this.databaseGameService.getAllGamesAsc();

        for (const game of games) {
            await this.upsertGameStatistics(game.id);
        }

        return { recalculated: games.length };
    }

    public getAverageScore(visits: GameVisit[]) {
        const visitsWithHits = visits.filter((visit) => visit.outcome === GameVisitOutcome.HIT);

        return (
            Math.round((visitsWithHits.reduce((acc, visit) => acc + visit.totalScored, 0) / visits.length) * 10) / 10
        );
    }

    public getAverageUntil60Points(visits: GameVisit[]) {
        const startingScore = visits[0].remainingScoreBefore;
        let score = startingScore;

        const throwScores = visits.flatMap((visit) => {
            return [
                (visit.throw1 ?? 0) * (visit.throw1Multiplier ?? 1),
                (visit.throw2 ?? 0) * (visit.throw2Multiplier ?? 1),
                (visit.throw3 ?? 0) * (visit.throw3Multiplier ?? 1),
            ];
        });

        if (throwScores.length === 0) return 0;

        const throwsBeforeFirstTime60OrLower = [];

        for (const throwScore of throwScores) {
            const newScore = score - throwScore;
            if (score <= 60) {
                break;
            }
            score = newScore;
            throwsBeforeFirstTime60OrLower.push(throwScore);
        }
        const pointsScored = startingScore - score;
        return Math.round((pointsScored / throwsBeforeFirstTime60OrLower.length) * 3 * 100) / 100;
    }

    public getThrowsOnDouble(visits: GameVisit[]) {
        const gameHistory = this.getGameHistory(visits);

        let throwsOnDouble = 0;

        const possibleFinishes = getPossibleFinishes();

        for (const throwScore of gameHistory) {
            if (possibleFinishes.includes(throwScore.scoreBeforeThrow)) {
                throwsOnDouble++;
            }
        }

        return throwsOnDouble;
    }

    private getGameHistory(visits: GameVisit[]): GameHistory[] {
        const startingScore = visits[0].remainingScoreBefore;
        const gameType = getGameTypeFromScore(startingScore);

        const points: GameHistory[] = [];
        let totalScore = getPointsForGameType(gameType);

        for (const visit of visits) {
            const scoreAtStartOfVisit = totalScore;
            const throws = [
                {
                    pointsScored: (visit.throw1 ?? 0) * (visit.throw1Multiplier ?? 1),
                    visitNumber: visit.visitNumber,
                },
                {
                    pointsScored: (visit.throw2 ?? 0) * (visit.throw2Multiplier ?? 1),
                    visitNumber: visit.visitNumber,
                },
                {
                    pointsScored: (visit.throw3 ?? 0) * (visit.throw3Multiplier ?? 1),
                    visitNumber: visit.visitNumber,
                },
            ];

            for (const throwData of throws) {
                const scoreBeforeThrow = totalScore;
                totalScore -= throwData.pointsScored;

                points.push({
                    pointsScored: throwData.pointsScored,
                    visitNumber: throwData.visitNumber,
                    scoreBeforeThrow,
                    scoreAfterThrow: totalScore <= 1 ? startingScore : totalScore,
                });
            }

            // If the visit was a bust, reset the score to what it was at the start of the visit
            if (visit.outcome === GameVisitOutcome.BUSTED) {
                totalScore = scoreAtStartOfVisit;
            }
        }

        return points;
    }

    public async getGamePreview(playerAId: string, playerBId: string): Promise<GamePreviewResponseDTO> {
        const playerA = await this.databaseUserService.findByUuid(playerAId);
        const playerB = await this.databaseUserService.findByUuid(playerBId);

        const playerAEloHistory = await this.databaseEloHistoryService.getCurrentRatingByUserId(playerAId);
        const playerBEloHistory = await this.databaseEloHistoryService.getCurrentRatingByUserId(playerBId);

        const playerAElo: EloRating = {
            elo: playerAEloHistory?.eloAfter ?? DEFAULT_ELO,
            gamesPlayed: playerAEloHistory?.gamesPlayedAfter ?? 0,
        };
        const playerBElo: EloRating = {
            elo: playerBEloHistory?.eloAfter ?? DEFAULT_ELO,
            gamesPlayed: playerBEloHistory?.gamesPlayedAfter ?? 0,
        };

        const ratingOnPlayerAWin = this.eloService.getNewRankings(playerAElo, playerBElo, GameResult.WIN_PLAYER_A);
        const ratingOnPlayerBWin = this.eloService.getNewRankings(playerAElo, playerBElo, GameResult.WIN_PLAYER_B);

        return {
            playerA: {
                id: playerA.id,
                name: playerA.name ?? '',
                elo: {
                    onWin: ratingOnPlayerAWin.playerA.newRating.elo,
                    onLoss: ratingOnPlayerBWin.playerA.newRating.elo,
                    current: playerAElo.elo,
                },
            },
            playerB: {
                id: playerB.id,
                name: playerB.name ?? '',
                elo: {
                    onWin: ratingOnPlayerBWin.playerB.newRating.elo,
                    onLoss: ratingOnPlayerAWin.playerB.newRating.elo,
                    current: playerBElo.elo,
                },
            },
        };
    }

    public async getGames({
        filter,
        pagination,
    }: {
        filter: GameFilter;
        pagination: Pagination;
    }): Promise<GameEntityApiDTO[]> {
        const games = await this.databaseGameService.getGames({ filter, pagination });

        return games.map((game) => this.databaseGameService.mapGameToDTO(game));
    }

    public async getGamesCount({ filter }: { filter: GameFilter }): Promise<number> {
        const count = await this.databaseGameService.getGamesCount({ filter });

        return count;
    }

    public async getGameById(id: string): Promise<GameEntityApiDTO> {
        const game = await this.databaseGameService.getGameById(id);
        return this.databaseGameService.mapGameToDTO(game);
    }

    public async getSummarizedGameStatistics(filter: GameFilter): Promise<GameStatisticsSummary> {
        const games = await this.databaseGameService.getGames({ filter });

        const statistics = games.flatMap((game) => game.gameStatistics);

        const summary = statistics.reduce<GameStatisticsSummary>(
            (acc, statistic) => {
                acc.averageScore += statistic.averageScore;
                acc.averageUntilFirstPossibleFinish += statistic.averageUntilFirstPossibleFinish;
                acc.throwsOnDouble += statistic.throwsOnDouble;
                return acc;
            },
            {
                averageScore: 0,
                averageUntilFirstPossibleFinish: 0,
                throwsOnDouble: 0,
                numberOfGames: statistics.length,
            },
        );

        Object.keys(summary).forEach((key) => {
            const value = summary[key as keyof GameStatisticsSummary];
            summary[key as keyof GameStatisticsSummary] = value / statistics.length;
        });

        return summary;
    }
}
