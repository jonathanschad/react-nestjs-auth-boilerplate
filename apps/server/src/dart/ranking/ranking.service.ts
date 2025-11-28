import { Injectable } from '@nestjs/common';
import { ordinal, rating } from 'openskill';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';

@Injectable()
export class RankingService {
    constructor(
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
    ) {}

    public async getEloRankingsAtTimestamp(timestamp: Date) {
        // Get all unique players who have played games before the timestamp
        const rankings = await this.databaseEloHistoryService.getRankingForUsersAtTimestamp(timestamp);

        return rankings;
    }

    public async getLatestEloRankings() {
        return this.getEloRankingsAtTimestamp(new Date());
    }

    public async getLatestOpenSkillRankings() {
        return this.getOpenSkillRankingsAtTimestamp(new Date());
    }

    public async getOpenSkillRankingsAtTimestamp(timestamp: Date) {
        const rankings = await this.databaseOpenSkillHistoryService.getRankingForUsersAtTimestamp(timestamp);

        return rankings.map((ranking) => ({
            userId: ranking.userId,
            ranking: ordinal(rating(ranking.ranking)),
        }));
    }
}
