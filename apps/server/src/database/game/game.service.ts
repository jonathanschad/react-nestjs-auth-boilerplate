import {
    EloHistory,
    type Game,
    GameCheckoutMode,
    GameStatisticsIndividual,
    GameTurn,
    GameType,
    OpenSkillHistory,
    Prisma,
} from '@darts/prisma';
import { GameCheckoutModeDTOEnum, GameEntityApiDTO, GameTypeDTOEnum } from '@darts/types/entities/game';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { PrismaService } from '@/database/prisma.service';
import { GameWithTurns } from '@/types/prisma';

@Injectable()
export class DatabaseGameService {
    constructor(private prisma: PrismaService) {}

    async getGamesByUserId(userId: string): Promise<Game[]> {
        return this.prisma.game.findMany({
            where: {
                OR: [{ playerAId: userId }, { playerBId: userId }],
            },
        });
    }

    async getGamesByUserIdPaginated(userId: string, page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize;

        const [games, total] = await Promise.all([
            this.prisma.game.findMany({
                where: {
                    OR: [{ playerAId: userId }, { playerBId: userId }],
                },
                orderBy: {
                    gameEnd: 'desc',
                },
                skip,
                take: pageSize,
                include: {
                    turns: {
                        orderBy: {
                            turnNumber: 'asc',
                        },
                    },
                    gameStatistics: true,
                    eloHistory: true,
                    openSkillHistory: true,
                },
            }),
            this.prisma.game.count({
                where: {
                    OR: [{ playerAId: userId }, { playerBId: userId }],
                },
            }),
        ]);

        return { games, total };
    }

    async getTotalGameCountByUserId(userId: string): Promise<number> {
        return this.prisma.game.count({
            where: {
                OR: [{ playerAId: userId }, { playerBId: userId }],
            },
        });
    }

    async getMostRecentGameByUserId(userId: string): Promise<Game | null> {
        return this.prisma.game.findFirst({
            where: {
                OR: [{ playerAId: userId }, { playerBId: userId }],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async createGame(game: Prisma.GameCreateArgs['data']): Promise<Game> {
        return this.prisma.game.create({
            data: game,
        });
    }

    async getGameWithTurnsById(id: string): Promise<GameWithTurns> {
        return this.prisma.game.findFirstOrThrow({
            where: { id },
            include: {
                turns: {
                    orderBy: {
                        turnNumber: 'asc',
                    },
                },
            },
        });
    }

    async find(where: Prisma.GameWhereInput): Promise<Game | null> {
        return this.prisma.game.findFirst({
            where,
        });
    }

    async getAllGamesAsc(): Promise<Game[]> {
        return this.prisma.game.findMany({
            orderBy: {
                gameStart: 'asc',
            },
        });
    }

    async clearAllGames(): Promise<void> {
        await this.prisma.gameStatisticsIndividual.deleteMany();
        await this.prisma.eloHistory.deleteMany();
        await this.prisma.openSkillHistory.deleteMany();
        await this.prisma.gameTurn.deleteMany();
        await this.prisma.game.deleteMany();
    }

    private mapGameTypeToDTOEnum(gameType: GameType): GameTypeDTOEnum {
        switch (gameType) {
            case GameType.X301:
                return GameTypeDTOEnum.X301;
            case GameType.X501:
                return GameTypeDTOEnum.X501;
        }
    }

    private mapGameCheckoutModeToDTOEnum(gameCheckoutMode: GameCheckoutMode): GameCheckoutModeDTOEnum {
        switch (gameCheckoutMode) {
            case GameCheckoutMode.SINGLE_OUT:
                return GameCheckoutModeDTOEnum.SINGLE_OUT;
            case GameCheckoutMode.DOUBLE_OUT:
                return GameCheckoutModeDTOEnum.DOUBLE_OUT;
            case GameCheckoutMode.MASTER_OUT:
                return GameCheckoutModeDTOEnum.MASTER_OUT;
        }
    }

    public mapGameToDTO(
        game: Game & {
            eloHistory: EloHistory[];
            openSkillHistory: OpenSkillHistory[];
            turns: GameTurn[];
            gameStatistics: GameStatisticsIndividual[];
        },
    ): GameEntityApiDTO {
        const playerAEloHistory = game.eloHistory.find((history) => history.playerId === game.playerAId);
        const playerBEloHistory = game.eloHistory.find((history) => history.playerId === game.playerBId);
        const playerAOpenSkillHistory = game.openSkillHistory.find((history) => history.playerId === game.playerAId);
        const playerBOpenSkillHistory = game.openSkillHistory.find((history) => history.playerId === game.playerBId);

        assert(playerAEloHistory);
        assert(playerBEloHistory);
        assert(playerAOpenSkillHistory);
        assert(playerBOpenSkillHistory);

        return {
            id: game.id,
            playerA: {
                id: game.playerAId,
                turns: game.turns.filter((turn) => turn.playerId === game.playerAId),
                gameStatistics: game.gameStatistics.find((stat) => stat.playerId === game.playerAId),
                eloHistory: playerAEloHistory,
                openSkillHistory: playerAOpenSkillHistory,
            },
            playerB: {
                id: game.playerBId,
                turns: game.turns.filter((turn) => turn.playerId === game.playerBId),
                gameStatistics: game.gameStatistics.find((stat) => stat.playerId === game.playerBId),
                eloHistory: playerBEloHistory,
                openSkillHistory: playerBOpenSkillHistory,
            },
            winnerId: game.winnerId,
            loserId: game.loserId,
            gameStart: game.gameStart,
            gameEnd: game.gameEnd,
            type: this.mapGameTypeToDTOEnum(game.type),
            checkoutMode: this.mapGameCheckoutModeToDTOEnum(game.checkoutMode),
        };
    }
}
