import { type Game, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
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
}
