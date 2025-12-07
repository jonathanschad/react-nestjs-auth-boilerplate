import { GameStatisticsIndividual, GameTurn, GameType, Prisma } from '@darts/prisma';
import type {
    CreateGameDTO,
    EloRating,
    GameEntityApiDTO,
    GameFilter,
    GamePreviewResponseDTO,
    Pagination,
} from '@darts/types';

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
import { getPointsForGameType, getPossibleFinishes } from '@/util/darts';

type GameHistory = {
    pointsScored: number;
    turnNumber: number;
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
        const playerA = await this.databaseUserService.findByUuid(createGameDto.playerAId);
        const playerB = await this.databaseUserService.findByUuid(createGameDto.playerBId);

        const playerARankingBefore = await this.rankingService.getCachedEloRanking(playerA.id);
        const playerBRankingBefore = await this.rankingService.getCachedEloRanking(playerB.id);

        const loser = createGameDto.winnerId === playerA.id ? playerB : playerA;

        const firstThrow = createGameDto.turns.find((turn) => turn.turnNumber === 0);

        createGameDto.turns.sort((a, b) => a.turnNumber - b.turnNumber);

        const game = await this.databaseGameService.createGame({
            id: uuid,
            playerAId: playerA.id,
            playerBId: playerB.id,
            gameStart: createGameDto.gameStart,
            gameEnd: createGameDto.gameEnd,
            winnerId: createGameDto.winnerId,
            loserId: loser.id,
            bullOffWinnerId: firstThrow?.playerId,
            type: createGameDto.type,
            checkoutMode: createGameDto.checkoutMode,
            turns: {
                createMany: {
                    data: [
                        ...createGameDto.turns.map(
                            (turn, index): Prisma.GameTurnCreateManyGameInput => ({
                                totalScore:
                                    (turn.throw1 ?? 0) * (turn.throw1Multiplier ?? 1) +
                                    (turn.throw2 ?? 0) * (turn.throw2Multiplier ?? 1) +
                                    (turn.throw3 ?? 0) * (turn.throw3Multiplier ?? 1),
                                playerId: turn.playerId,
                                turnNumber: index,
                                throw1: turn.throw1,
                                throw1Multiplier: turn.throw1Multiplier,
                                throw2: turn.throw2,
                                throw2Multiplier: turn.throw2Multiplier,
                                throw3: turn.throw3,
                                throw3Multiplier: turn.throw3Multiplier,
                            }),
                        ),
                    ],
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
        const game = await this.databaseGameService.getGameWithTurnsById(gameId);

        const playerAThrows = game.turns.filter((turn) => turn.playerId === game.playerAId);
        const playerBThrows = game.turns.filter((turn) => turn.playerId === game.playerBId);

        if (playerAThrows.length > 0) {
            await this.databaseGameStatisticService.upsertGameStatistics({
                gameId: game.id,
                playerId: game.playerAId,
                averageScore: this.getAverageScore(playerAThrows),
                averageUntilFirstPossibleFinish: this.getAverageUntil50Points(playerAThrows, game.type),
                throwsOnDouble: this.getThrowsOnDouble(playerAThrows, game.type),
                wonBullOff: game.turns[0].playerId === game.playerAId,
            });
        }

        if (playerBThrows.length > 0) {
            await this.databaseGameStatisticService.upsertGameStatistics({
                gameId: game.id,
                playerId: game.playerBId,
                averageScore: this.getAverageScore(playerBThrows),
                averageUntilFirstPossibleFinish: this.getAverageUntil50Points(playerBThrows, game.type),
                throwsOnDouble: this.getThrowsOnDouble(playerBThrows, game.type),
                wonBullOff: game.turns[0].playerId === game.playerBId,
            });
        }
    }

    public getAverageScore(throws: GameTurn[]) {
        return Math.round((throws.reduce((acc, turn) => acc + turn.totalScore, 0) / throws.length) * 10) / 10;
    }

    public getAverageUntil50Points(throws: GameTurn[], gameType: GameType) {
        const gameHistory = this.getGameHistory(throws, gameType);

        const gameHistoryFiltered = gameHistory.filter((turn) => turn.scoreAfterThrow > 50);

        return (
            Math.round(
                (gameHistoryFiltered.reduce((acc, turn) => acc + turn.pointsScored, 0) / gameHistoryFiltered.length) *
                    10,
            ) / 10
        );
    }

    public getThrowsOnDouble(throws: GameTurn[], gameType: GameType) {
        const gameHistory = this.getGameHistory(throws, gameType);
        const possibleFinishes = getPossibleFinishes();

        const gameHistoryFiltered = gameHistory.filter((turn) => possibleFinishes.includes(turn.scoreBeforeThrow));

        return gameHistoryFiltered.length;
    }

    private getGameHistory(throws: GameTurn[], gameType: GameType): GameHistory[] {
        const points = throws.flatMap((turn) => [
            {
                pointsScored: (turn.throw1 ?? 0) * (turn.throw1Multiplier ?? 1),
                turnNumber: turn.turnNumber,
                scoreAfterThrow: 0,
                scoreBeforeThrow: 0,
            },
            {
                pointsScored: (turn.throw2 ?? 0) * (turn.throw2Multiplier ?? 1),
                turnNumber: turn.turnNumber,
                scoreAfterThrow: 0,
                scoreBeforeThrow: 0,
            },
            {
                pointsScored: (turn.throw3 ?? 0) * (turn.throw3Multiplier ?? 1),
                turnNumber: turn.turnNumber,
                scoreAfterThrow: 0,
                scoreBeforeThrow: 0,
            },
        ]);

        let totalScore = getPointsForGameType(gameType);
        for (const point of points) {
            point.scoreBeforeThrow = totalScore;
            totalScore -= point.pointsScored;
            point.scoreAfterThrow = totalScore;
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
