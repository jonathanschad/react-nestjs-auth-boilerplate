import { Module } from '@nestjs/common';
import { PlayerController } from '@/dart/player/player.controller';
import { PlayerService } from '@/dart/player/player.service';
import { RankingModule } from '@/dart/ranking/ranking.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule, RankingModule],
    controllers: [PlayerController],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
