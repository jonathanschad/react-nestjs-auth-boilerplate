import { OpenSkillHistory, Prisma } from '@darts/prisma';
import { PublicUser } from '@darts/types/entities/user';
import { Injectable } from '@nestjs/common';
import { type Rating, rating } from 'openskill';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { DatabaseHistoryInterface } from '@/database/history/database-history.interface';
import { PrismaService } from '@/database/prisma.service';
import { DatabaseUserService } from '@/database/user/user.service';

const ordinalService = new OpenSkillService();
@Injectable()
export class DatabaseOpenSkillHistoryService
    implements DatabaseHistoryInterface<OpenSkillHistory, Prisma.OpenSkillHistoryCreateInput, Rating>
{
    constructor(
        private readonly prisma: PrismaService,
        private readonly databaseUserService: DatabaseUserService,
    ) {}

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

    public async getRankingForUsersAtTimestamp(
        timestamp: Date,
    ): Promise<{ user: PublicUser; rating: Rating; rank: number; score: number }[]> {
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
                return {
                    user: this.databaseUserService.sanitizeUser(player),
                    ranking: await this.getRankingForUserAtTimestamp(player.id, timestamp),
                };
            }),
        );

        return rankings
            .sort((a, b) => -ordinalService.compareRankings(a.ranking, b.ranking))
            .map((ranking, index) => ({
                user: ranking.user,
                rank: index + 1,
                rating: ranking.ranking,
                score: ordinalService.formatRatingIntoScore(ranking.ranking),
            }));
    }
}
