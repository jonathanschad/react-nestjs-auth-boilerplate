import { Module } from '@nestjs/common';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { RankingHistoryService } from '@/dart/ranking/ranking-history.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [EloService, OpenSkillService, RankingHistoryService],
    exports: [EloService, OpenSkillService, RankingHistoryService],
})
export class RankingModule {}
