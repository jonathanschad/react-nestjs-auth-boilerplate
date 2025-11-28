import { OpenSkillHistory, Prisma } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { type Rating, rating } from 'openskill';
import { DatabaseHistoryInterface } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class DatabaseOpenSkillHistoryService
    implements DatabaseHistoryInterface<OpenSkillHistory, Prisma.OpenSkillHistoryCreateInput, Rating>
{
    constructor(private prisma: PrismaService) {}

    async getCurrentRatingByUserId(userId: string): Promise<Rating> {
        return this.getRankingForUserAtTimestamp(userId, new Date());
    }

    public async getRankingForUserAtTimestamp(userId: string, timestamp: Date): Promise<Rating> {
        const lastOpenSkillHistory = await this.prisma.openSkillHistory.findFirst({
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

        return lastOpenSkillHistory
            ? rating({ mu: lastOpenSkillHistory.muAfter, sigma: lastOpenSkillHistory.sigmaAfter })
            : rating();
    }

    public getPlayerHistory(userId: string): Promise<OpenSkillHistory[]> {
        return this.prisma.openSkillHistory.findMany({
            where: {
                playerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    public createHistoryEntry(entry: Prisma.OpenSkillHistoryCreateInput): Promise<OpenSkillHistory> {
        return this.prisma.openSkillHistory.create({
            data: entry,
        });
    }

    public async clearHistory(): Promise<void> {
        await this.prisma.openSkillHistory.deleteMany();
    }

    public async getRankingForUsersAtTimestamp(timestamp: Date): Promise<{ userId: string; ranking: Rating }[]> {
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
