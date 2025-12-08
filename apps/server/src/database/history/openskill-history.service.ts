import { OpenSkillHistory, Prisma, User } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { type Rating, rating } from 'openskill';
import { DatabaseHistoryInterface, RankingHistoryWithGame } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class DatabaseOpenSkillHistoryService
    implements DatabaseHistoryInterface<OpenSkillHistory, Prisma.OpenSkillHistoryCreateInput, Rating>
{
    constructor(
        private readonly prisma: PrismaService,
        private readonly databaseUserService: DatabaseUserService,
    ) {}

    async getCurrentRatingByUserId(userId: string): Promise<RankingHistoryWithGame<OpenSkillHistory> | null> {
        return this.getRankingForUserAtTimestamp(userId, new Date());
    }

    public async getRankingForUserAtTimestamp(
        userId: string,
        timestamp: Date,
    ): Promise<RankingHistoryWithGame<OpenSkillHistory> | null> {
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
            include: {
                game: true,
            },
        });

        return lastOpenSkillHistory;
    }

    public getPlayerHistory(
        userId: string,
        filter?: Prisma.OpenSkillHistoryWhereInput,
    ): Promise<RankingHistoryWithGame<OpenSkillHistory>[]> {
        return this.prisma.openSkillHistory.findMany({
            where: {
                playerId: userId,
                ...(filter ?? {}),
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                game: true,
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

    public async getRankingForUsersAtTimestamp(
        timestamp: Date,
    ): Promise<{ user: User; ranking: RankingHistoryWithGame<OpenSkillHistory> | null; gameCount: number }[]> {
        const playersWithGamesAtTimestamp = await this.prisma.user.findMany({
            where: {
                openSkillHistory: {
                    some: {
                        game: {
                            gameEnd: {
                                lte: timestamp,
                            },
                        },
                    },
                },
            },
        });

        const rankings = await Promise.all(
            playersWithGamesAtTimestamp.map(async (player) => {
                const gameCount = await this.prisma.openSkillHistory.count({
                    where: {
                        playerId: player.id,
                        game: {
                            gameEnd: {
                                lte: timestamp,
                            },
                        },
                    },
                });

                return {
                    user: player,
                    ranking: await this.getRankingForUserAtTimestamp(player.id, timestamp),
                    gameCount,
                };
            }),
        );

        return rankings;
    }

    public getRatingFromHistoryEntry(historyEntry: OpenSkillHistory | null): Rating {
        if (!historyEntry) {
            return rating();
        }

        return rating({ mu: historyEntry.muAfter, sigma: historyEntry.sigmaAfter });
    }
}
