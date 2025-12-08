import { type Game, Prisma } from '@darts/prisma';
import { GameEntityApiDTO, GameFilter, Pagination } from '@darts/types';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { PrismaService } from '@/database/prisma.service';
import { GameWithTurns } from '@/types/prisma';

export type GameWithExpandedRelations = Prisma.GameGetPayload<{
    include: {
        turns: true;
        gameStatistics: true;
        eloHistory: true;
        openSkillHistory: true;
    };
}>;
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

    async getGamesByUserIdPaginated(userId: string, pagination: Pagination) {
        const take = pagination.pageSize ?? 10;
        const skip = (pagination.page ?? 0) * take;

        const games = await this.prisma.game.findMany({
            where: {
                OR: [{ playerAId: userId }, { playerBId: userId }],
            },
            orderBy: {
                gameEnd: 'desc',
            },
            skip,
            take,
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
        });

        return games;
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

    async getGameById(id: string): Promise<GameWithExpandedRelations> {
        return this.prisma.game.findFirstOrThrow({
            where: { id },
            include: {
                turns: true,
                gameStatistics: true,
                eloHistory: true,
                openSkillHistory: true,
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

    async getOpponentsByUserId(userId: string): Promise<string[]> {
        const gamesWherePlayerA = await this.prisma.game.findMany({
            where: {
                playerAId: userId,
            },
            select: {
                playerBId: true,
            },
            distinct: ['playerBId'],
        });
        const gamesWherePlayerB = await this.prisma.game.findMany({
            where: {
                playerBId: userId,
            },
            select: {
                playerAId: true,
            },
            distinct: ['playerAId'],
        });

        const opponents = new Set([
            ...gamesWherePlayerA.map((game) => game.playerBId),
            ...gamesWherePlayerB.map((game) => game.playerAId),
        ]);
        return Array.from(opponents);
    }

    async getGames({
        filter,
        orderBy = { gameEnd: 'desc' },
        pagination,
    }: {
        filter: GameFilter;
        orderBy?: Prisma.GameOrderByWithRelationInput;
        pagination?: Pagination;
    }): Promise<GameWithExpandedRelations[]> {
        const take = pagination?.pageSize ?? 10;
        const skip = pagination?.page ? (pagination.page - 1) * take : 0;

        const where: Prisma.GameWhereInput = {};
        if (filter.playerIds) {
            where.OR = filter.playerIds.map(([playerA, playerB]) => {
                if (!playerB) {
                    return { OR: [{ playerAId: playerA }, { playerBId: playerA }] };
                } else {
                    return {
                        OR: [
                            { playerAId: playerA, playerBId: playerB },
                            { playerAId: playerB, playerBId: playerA },
                        ],
                    };
                }
            });
        }
        if (filter.timeFrame) {
            where.gameStart = { gte: filter.timeFrame.startDate, lte: filter.timeFrame.endDate };
        }
        if (filter.type) {
            where.type = filter.type;
        }
        if (filter.checkoutMode) {
            where.checkoutMode = filter.checkoutMode;
        }

        const games = await this.prisma.game.findMany({
            where,
            include: {
                turns: true,
                gameStatistics: true,
                eloHistory: true,
                openSkillHistory: true,
            },
            orderBy,
            ...(pagination?.page ? { skip, take } : {}),
        });

        return games;
    }

    async getGamesCount({ filter }: { filter: GameFilter }): Promise<number> {
        const where: Prisma.GameWhereInput = {};
        if (filter.playerIds) {
            where.OR = filter.playerIds.map(([playerA, playerB]) => {
                if (!playerB) {
                    return { OR: [{ playerAId: playerA }, { playerBId: playerA }] };
                } else {
                    return {
                        OR: [
                            { playerAId: playerA, playerBId: playerB },
                            { playerAId: playerB, playerBId: playerA },
                        ],
                    };
                }
            });
        }
        if (filter.timeFrame) {
            where.gameStart = { gte: filter.timeFrame.startDate, lte: filter.timeFrame.endDate };
        }
        if (filter.type) {
            where.type = filter.type;
        }
        if (filter.checkoutMode) {
            where.checkoutMode = filter.checkoutMode;
        }

        const games = await this.prisma.game.count({
            where,
        });

        return games;
    }

    async clearAllGames(): Promise<void> {
        await this.prisma.gameStatisticsIndividual.deleteMany();
        await this.prisma.eloHistory.deleteMany();
        await this.prisma.openSkillHistory.deleteMany();
        await this.prisma.gameTurn.deleteMany();
        await this.prisma.game.deleteMany();
    }

    public mapGameToDTO(game: GameWithExpandedRelations): GameEntityApiDTO {
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
            gameStart: game.gameStart.toISOString(),
            gameEnd: game.gameEnd.toISOString(),
            type: game.type,
            checkoutMode: game.checkoutMode,
        };
    }
}
