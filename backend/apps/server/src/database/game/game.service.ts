import { type Game } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

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
}
