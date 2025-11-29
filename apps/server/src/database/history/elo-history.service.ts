import { EloHistory, Game, Prisma, User } from '@darts/prisma';
import { EloRating } from '@darts/types/api/ranking/ranking.dto';
import { Injectable } from '@nestjs/common';
import { DEFAULT_ELO } from '@/dart/ranking/elo.service';
import { DatabaseHistoryInterface, RankingHistoryWithGame } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class DatabaseEloHistoryService
    implements DatabaseHistoryInterface<EloHistory, Prisma.EloHistoryCreateInput, EloRating>
{
    constructor(
        private prisma: PrismaService,
        private databaseUserService: DatabaseUserService,
    ) {}

    public async getCurrentRatingByUserId(userId: string): Promise<RankingHistoryWithGame<EloHistory> | null> {
        return this.getRankingForUserAtTimestamp(userId, new Date());
    }

    public async getRankingForUserAtTimestamp(
        userId: string,
        timestamp: Date,
    ): Promise<(EloHistory & { game: Game }) | null> {
        const lastEloHistory = await this.prisma.eloHistory.findFirst({
            where: {
                playerId: userId,
                game: {
                    gameEnd: {
                        lte: timestamp,
                    },
                },
            },
            include: {
                game: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return lastEloHistory;
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

    public async getRankingForUsersAtTimestamp(
        timestamp: Date,
    ): Promise<{ user: User; ranking: RankingHistoryWithGame<EloHistory> | null; gameCount: number }[]> {
        const playersWithGamesAtTimestamp = await this.prisma.user.findMany({
            where: {
                eloHistory: {
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
                const gameCount = await this.prisma.eloHistory.count({
                    where: {
                        playerId: player.id,
                        game: {
                            gameEnd: {
                                lte: timestamp,
                            },
                        },
                    },
                });

                const ranking = await this.getRankingForUserAtTimestamp(player.id, timestamp);
                return {
                    user: player,
                    ranking,
                    gameCount,
                };
            }),
        );

        return rankings;
    }

    public getRatingFromHistoryEntry(historyEntry: EloHistory | null): EloRating {
        if (!historyEntry) {
            return { elo: DEFAULT_ELO, gamesPlayed: 0 };
        }

        return { elo: historyEntry.eloAfter, gamesPlayed: historyEntry.gamesPlayedAfter };
    }
}
