import { EloHistory, Prisma } from '@darts/prisma';
import { PublicUser } from '@darts/types/entities/user';
import { Injectable } from '@nestjs/common';
import { DEFAULT_ELO, EloService } from '@/dart/ranking/elo.service';
import { DatabaseHistoryInterface } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';

const eloService = new EloService();
@Injectable()
export class DatabaseEloHistoryService
    implements DatabaseHistoryInterface<EloHistory, Prisma.EloHistoryCreateInput, number>
{
    constructor(
        private prisma: PrismaService,
        private databaseUserService: DatabaseUserService,
    ) {}

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

    public async getRankingForUsersAtTimestamp(
        timestamp: Date,
    ): Promise<{ user: PublicUser; rating: number; rank: number; score: number }[]> {
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
                return {
                    user: player,
                    ranking: await this.getRankingForUserAtTimestamp(player.id, timestamp),
                };
            }),
        );

        return rankings
            .sort((a, b) => -eloService.compareRankings(a.ranking, b.ranking))
            .map((ranking, index) => {
                return {
                    user: this.databaseUserService.sanitizeUser(ranking.user),
                    rating: ranking.ranking,
                    rank: index + 1,
                    score: eloService.formatRatingIntoScore(ranking.ranking),
                };
            });
    }
}
