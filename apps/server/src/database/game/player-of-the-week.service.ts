import { PlayerOfTheWeek, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class PlayerOfTheWeekDatabaseService {
    constructor(private readonly prisma: PrismaService) {}

    public async getPlayerOfTheWeekHistory(): Promise<Array<PlayerOfTheWeek>> {
        return this.prisma.playerOfTheWeek.findMany({
            orderBy: {
                weekStart: 'desc',
            },
        });
    }

    public async upsertPlayerOfTheWeek(
        playerOfTheWeek: Prisma.PlayerOfTheWeekCreateArgs['data'],
    ): Promise<PlayerOfTheWeek> {
        const weekStart = dayjs(playerOfTheWeek.weekStart).startOf('week');
        playerOfTheWeek.weekStart = weekStart.toDate();

        return this.prisma.playerOfTheWeek.upsert({
            where: { weekStart: weekStart.toDate() },
            update: playerOfTheWeek,
            create: playerOfTheWeek,
        });
    }

    public async getPlayerOfTheWeekWinsCount(playerId: string): Promise<number> {
        return this.prisma.playerOfTheWeek.count({
            where: {
                playerId,
            },
        });
    }
}
