import { GameTurn, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import type { CreateGameDTO, GamePreviewResponseDTO } from '@/dart/game/game.dto';
import { DatabaseEloHistoryService } from '@/database/elo-history/elo-history.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseGameStatisticService } from '@/database/game/game-statistic.service';
import { DatabaseGameTurnService } from '@/database/game/game-turn.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class GameService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseGameTurnService: DatabaseGameTurnService,
        private readonly databaseGameStatisticService: DatabaseGameStatisticService,
    ) {}

    async createGame(uuid: string, createGameDto: CreateGameDTO) {
        const playerA = await this.databaseUserService.findByUuid(createGameDto.playerAId);
        const playerB = await this.databaseUserService.findByUuid(createGameDto.playerBId);

        const loser = createGameDto.winnerId === playerA.id ? playerB : playerA;

        const firstThrow = createGameDto.turns.find((turn) => turn.turnNumber === 0);
        assert(firstThrow, 'First throw is required');

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

        return;
    }

    private async upsertGameStatistics(gameId: string) {
        const game = await this.databaseGameService.getGameWithTurnsById(gameId);

        const playerAThrows = game.turns.filter((turn) => turn.playerId === game.playerAId);
        const playerBThrows = game.turns.filter((turn) => turn.playerId === game.playerBId);

        await this.databaseGameStatisticService.upsertGameStatistics({
            gameId: game.id,
            playerId: game.playerAId,
            averageScore: this.getAverageScore(playerAThrows),
            averageUntilFirstPossibleFinish: this.getAverageUntilFirstPossibleFinish(playerAThrows),
            throwsOnDouble: this.getThrowsOnDouble(playerAThrows),
            wonBullOff: game.turns[0].playerId === game.playerAId,
        });

        await this.databaseGameStatisticService.upsertGameStatistics({
            gameId: game.id,
            playerId: game.playerBId,
            averageScore: this.getAverageScore(playerBThrows),
            averageUntilFirstPossibleFinish: this.getAverageUntilFirstPossibleFinish(playerBThrows),
            throwsOnDouble: this.getThrowsOnDouble(playerBThrows),
            wonBullOff: game.turns[0].playerId === game.playerBId,
        });
    }

    public getAverageScore(throws: GameTurn[]) {
        // TODO: proper algorithm for this
        return throws.reduce((acc, turn) => acc + turn.totalScore, 0) / throws.length;
    }

    public getAverageUntilFirstPossibleFinish(throws: GameTurn[]) {
        // TODO: proper algorithm for this
        return throws.reduce((acc, turn) => acc + turn.totalScore, 0) / throws.length;
    }

    public getThrowsOnDouble(throws: GameTurn[]) {
        // TODO: proper algorithm for this
        return throws.filter(
            (turn) => turn.throw1Multiplier === 2 || turn.throw2Multiplier === 2 || turn.throw3Multiplier === 2,
        ).length;
    }

    public async getGamePreview(playerAId: string, playerBId: string): Promise<GamePreviewResponseDTO> {
        const playerA = await this.databaseUserService.findByUuid(playerAId);
        const playerB = await this.databaseUserService.findByUuid(playerBId);

        const playerAElo = await this.databaseEloHistoryService.getCurrentEloByUserId(playerAId);
        const playerBElo = await this.databaseEloHistoryService.getCurrentEloByUserId(playerBId);

        return {
            playerA: {
                id: playerA.id,
                name: playerA.name ?? '',
                elo: {
                    onWin: 0,
                    onLoss: 0,
                    current: playerAElo ?? 1000,
                },
            },
            playerB: {
                id: playerB.id,
                name: playerB.name ?? '',
                elo: {
                    onWin: 0,
                    onLoss: 0,
                    current: playerBElo ?? 1000,
                },
            },
        };
    }
}
