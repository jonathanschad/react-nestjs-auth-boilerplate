import { GameStatisticsIndividual, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseGameStatisticService {
    constructor(private prisma: PrismaService) {}

    async upsertGameStatistics(
        gameStatistics: Prisma.GameStatisticsIndividualCreateArgs['data'] & { gameId: string; playerId: string },
    ): Promise<GameStatisticsIndividual> {
        return this.prisma.gameStatisticsIndividual.upsert({
            where: { gameId_playerId: { gameId: gameStatistics.gameId, playerId: gameStatistics.playerId } },
            update: gameStatistics,
            create: gameStatistics,
        });
    }
}
