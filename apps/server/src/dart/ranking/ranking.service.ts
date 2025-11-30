import { EloRating } from '@darts/types/api/ranking/ranking.dto';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { Rating, rating } from 'openskill';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';

@Injectable()
export class RankingService {
    public eloRankCache: Map<string, { rating: EloRating; rank: number }> = new Map();
    public openSkillRankCache: Map<string, { rating: Rating; rank: number }> = new Map();

    constructor(
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
        private readonly openSkillService: OpenSkillService,
        private readonly eloService: EloService,
    ) {}

    public async getLatestEloRankings() {
        const rankings = await this.getEloRankingsAtTimestamp(new Date());
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

    public getCachedEloRanking(userId: string) {
        return this.eloRankCache.get(userId);
    }

    public getCachedOpenSkillRanking(userId: string) {
        return this.openSkillRankCache.get(userId);
    }

    public async updateCachedRankings() {
        this.eloRankCache.clear();

        await this.getLatestEloRankings();
        await this.getLatestOpenSkillRankings();
    }
}
