import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { rating } from 'openskill';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class RankingService {
    constructor(
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
        private readonly openSkillService: OpenSkillService,
        private readonly eloService: EloService,
        private readonly databaseUserService: DatabaseUserService,
    ) {}

    public async getLatestEloRankings() {
        return this.getEloRankingsAtTimestamp(new Date());
    }

    public async getLatestOpenSkillRankings() {
        return this.getOpenSkillRankingsAtTimestamp(new Date());
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
                    ...ranking,
                    user: this.databaseUserService.sanitizeUser(ranking.user),
                    rating: rating({ mu: ranking.ranking!.ordinalAfter, sigma: ranking.ranking!.sigmaAfter }),
                    score: this.openSkillService.formatRatingIntoScore(
                        rating({ mu: ranking.ranking!.ordinalAfter, sigma: ranking.ranking!.sigmaAfter }),
                    ),
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
                    ...ranking,
                    user: this.databaseUserService.sanitizeUser(ranking.user),
                    rating: ranking.ranking!.eloAfter,
                    score: ranking.ranking!.eloAfter,
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
}
