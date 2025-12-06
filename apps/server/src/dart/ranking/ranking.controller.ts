import { api } from '@darts/types';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RankingService } from '@/dart/ranking/ranking.service';

@Controller()
export class RankingController {
    constructor(private readonly rankingService: RankingService) {}

    @TsRestHandler(api.dart.rankings.elo)
    public getAllRankings() {
        return tsRestHandler(api.dart.rankings.elo, async () => {
            const result = await this.rankingService.getLatestEloRankings();
            return { status: 200 as const, body: result };
        });
    }

    @TsRestHandler(api.dart.rankings.openskill)
    public getAllOpenSkillRankings() {
        return tsRestHandler(api.dart.rankings.openskill, async () => {
            const result = await this.rankingService.getLatestOpenSkillRankings();
            return { status: 200 as const, body: result };
        });
    }
}
