import { Game, GameStatisticsIndividual, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '@/database/prisma.service';

export type GameStatisticsIndividualWithGame = GameStatisticsIndividual & { game: Game };
@Injectable()
export class DatabaseGameStatisticService {
    constructor(private prisma: PrismaService) {}

    async upsertGameStatistics(
        gameStatistics: Prisma.GameStatisticsIndividualCreateArgs['data'] & { gameId: string; playerId: string },
    ): Promise<GameStatisticsIndividual> {
        const { gameId, playerId, ...stats } = gameStatistics;
        return this.prisma.gameStatisticsIndividual.upsert({
            where: { gameId_playerId: { gameId, playerId } },
            update: { ...stats, gameId, playerId },
            create: {
                ...stats,
                game: { connect: { id: gameId } },
                player: { connect: { id: playerId } },
            },
        });
    }

    async getPlayerGameStatisticsHistory(
        playerId: string,
        filter?: Prisma.GameStatisticsIndividualWhereInput,
    ): Promise<GameStatisticsIndividualWithGame[]> {
        const gameStatistics = await this.prisma.gameStatisticsIndividual.findMany({
            where: { playerId, game: { gameEnd: { gte: dayjs().subtract(1, 'year').toDate() } }, ...(filter ?? {}) },
            orderBy: {
                game: {
                    gameEnd: 'desc',
                },
            },
            include: {
                game: true,
            },
        });

        return gameStatistics;
    }
}
