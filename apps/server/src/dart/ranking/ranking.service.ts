import type { EloRating, RankingCache } from '@darts/types';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import dayjs from 'dayjs';
import { Rating, rating } from 'openskill';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';

@Injectable()
export class RankingService implements OnApplicationBootstrap {
    public eloRankCache: Map<string, RankingCache<EloRating>> = new Map();
    public openSkillRankCache: Map<string, RankingCache<Rating>> = new Map();

    constructor(
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
        private readonly openSkillService: OpenSkillService,
        private readonly eloService: EloService,
    ) {}

    public async onApplicationBootstrap() {
        await this.updateCachedRankings();
    }

    public async getLatestEloRankings() {
        const rankings = await this.getEloRankingsAtTimestamp(new Date());
        // TODO handle unranked players and inactive players
        for (const ranking of rankings) {
            this.eloRankCache.set(ranking.userId, {
                rating: ranking.rating,
                rank: ranking.rank,
            });
        }

        return rankings;
    }

    public async getLatestOpenSkillRankings() {
        const rankings = await this.getOpenSkillRankingsAtTimestamp(new Date());
        for (const ranking of rankings) {
            this.openSkillRankCache.set(ranking.userId, {
                rating: ranking.rating,
                rank: ranking.rank,
            });
        }

        return rankings;
    }

    public async getOpenSkillRankingsAtTimestamp(timestamp: Date) {
        const rankings = await this.databaseOpenSkillHistoryService.getRankingForUsersAtTimestamp(timestamp);

        const lastGameRatingCutoff = dayjs(timestamp).subtract(1, 'month').toDate();

        return rankings
            .filter((ranking) => ranking.gameCount >= 10)
            .filter((ranking) => ranking.ranking !== null)
            .filter((ranking) => dayjs(ranking.ranking!.game.gameEnd).isAfter(lastGameRatingCutoff))
            .map((ranking) => {
                return {
                    userId: ranking.user.id,
                    rating: rating({ mu: ranking.ranking!.muAfter, sigma: ranking.ranking!.sigmaAfter }),
                    score: this.openSkillService.formatRatingIntoScore(
                        rating({ mu: ranking.ranking!.muAfter, sigma: ranking.ranking!.sigmaAfter }),
                    ),
                    gamesPlayed: ranking.gameCount,
                };
            })
            .sort((a, b) => -this.openSkillService.compareRankings(a.rating, b.rating))
            .map((ranking, index) => {
                return {
                    ...ranking,
                    rank: index + 1,
                };
            });
    }

    public async getEloRankingsAtTimestamp(timestamp: Date) {
        const rankings = await this.databaseEloHistoryService.getRankingForUsersAtTimestamp(timestamp);

        const lastGameRatingCutoff = dayjs(timestamp).subtract(1, 'month').toDate();

        return rankings
            .filter((ranking) => ranking.gameCount >= 10)
            .filter((ranking) => ranking.ranking !== null)
            .filter((ranking) => dayjs(ranking.ranking!.game.gameEnd).isAfter(lastGameRatingCutoff))
            .map((ranking) => {
                return {
                    userId: ranking.user.id,
                    rating: this.databaseEloHistoryService.getRatingFromHistoryEntry(ranking.ranking),
                    score: ranking.ranking!.eloAfter,
                    gamesPlayed: ranking.gameCount,
                };
            })
            .sort((a, b) => -this.eloService.compareRankings(a.rating, b.rating))
            .map((ranking, index) => {
                return {
                    ...ranking,
                    rank: index + 1,
                };
            });
    }

    public async getCachedEloRanking(userId: string): Promise<RankingCache<EloRating>> {
        const cached = this.eloRankCache.get(userId);
        if (!cached) {
            const eloHistory = await this.databaseEloHistoryService.getRankingForUserAtTimestamp(userId, new Date());
            return {
                rating: this.databaseEloHistoryService.getRatingFromHistoryEntry(eloHistory),
                rank: null,
            };
        }

        return cached;
    }

    public async getCachedOpenSkillRanking(userId: string): Promise<RankingCache<Rating>> {
        const cached = this.openSkillRankCache.get(userId);
        if (!cached) {
            const openSkillHistory = await this.databaseOpenSkillHistoryService.getRankingForUserAtTimestamp(
                userId,
                new Date(),
            );
            return {
                rating: this.databaseOpenSkillHistoryService.getRatingFromHistoryEntry(openSkillHistory),
                rank: null,
            };
        }

        return cached;
    }

    public async updateCachedRankings() {
        this.eloRankCache.clear();

        await this.getLatestEloRankings();
        await this.getLatestOpenSkillRankings();
    }
}
