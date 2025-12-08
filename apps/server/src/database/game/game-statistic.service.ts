import { GameStatisticsIndividual, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

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
}
