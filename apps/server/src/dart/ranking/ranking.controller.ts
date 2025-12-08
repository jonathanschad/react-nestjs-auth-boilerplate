import { api } from '@darts/types';
import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { RankingService } from '@/dart/ranking/ranking.service';

@Controller()
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    @Implement(api.dart.rankings.elo)
    public getAllRankings() {
        return implement(api.dart.rankings.elo).handler(async () => {
            const result = await this.rankingService.getLatestEloRankings();
            return result;
        });
    }

    @Implement(api.dart.rankings.openskill)
    public getAllOpenSkillRankings() {
        return implement(api.dart.rankings.openskill).handler(async () => {
            const result = await this.rankingService.getLatestOpenSkillRankings();
            return result;
        });
    }
}
