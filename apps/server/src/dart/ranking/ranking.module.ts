import { Module } from '@nestjs/common';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { RankingController } from '@/dart/ranking/ranking.controller';
import { RankingService } from '@/dart/ranking/ranking.service';
import { RankingHistoryService } from '@/dart/ranking/ranking-history.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [EloService, OpenSkillService, RankingHistoryService, RankingService],
    exports: [EloService, OpenSkillService, RankingHistoryService, RankingService],
    controllers: [RankingController],
})
export class RankingModule {}
