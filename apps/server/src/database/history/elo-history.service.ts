import { EloHistory, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { DEFAULT_ELO } from '@/dart/ranking/elo.service';
import { DatabaseHistoryInterface } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseEloHistoryService
    implements DatabaseHistoryInterface<EloHistory, Prisma.EloHistoryCreateInput, number>
{
    constructor(private prisma: PrismaService) {}

    public async getCurrentRatingByUserId(userId: string): Promise<number> {
        return this.getRankingForUserAtTimestamp(userId, new Date());
    }

    public async getRankingForUserAtTimestamp(userId: string, timestamp: Date): Promise<number> {
        const lastEloHistory = await this.prisma.eloHistory.findFirst({
            where: {
                playerId: userId,
                game: {
                    gameEnd: {
                        lte: timestamp,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return lastEloHistory?.eloAfter ?? DEFAULT_ELO;
    }

    public getPlayerHistory(userId: string): Promise<EloHistory[]> {
        return this.prisma.eloHistory.findMany({
            where: {
                playerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    public createHistoryEntry(entry: Prisma.EloHistoryCreateInput): Promise<EloHistory> {
        return this.prisma.eloHistory.create({
            data: entry,
        });
    }

    public async clearHistory(): Promise<void> {
        await this.prisma.eloHistory.deleteMany();
    }

    public async getRankingForUsersAtTimestamp(timestamp: Date): Promise<{ userId: string; ranking: number }[]> {
        const playersWithGamesAtTimestamp = await this.prisma.eloHistory.findMany({
            where: {
                game: {
                    gameEnd: {
                        lte: timestamp,
                    },
                },
            },
            distinct: ['playerId'],
            select: {
                playerId: true,
            },
        });

        return await Promise.all(
            playersWithGamesAtTimestamp.map(async (player) => {
                return {
                    userId: player.playerId,
                    ranking: await this.getRankingForUserAtTimestamp(player.playerId, timestamp),
                };
            }),
        );
    }
}
