import { Module } from '@nestjs/common';
import { GameModule } from '@/dart/game/game.module';
import { PlayerController } from '@/dart/player/player.controller';
import { PlayerService } from '@/dart/player/player.service';
import { PlayerOfTheWeekController } from '@/dart/player/player-of-the-week.controller';
import { PlayerOfTheWeekService } from '@/dart/player/player-of-the-week.service';
import { RankingModule } from '@/dart/ranking/ranking.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule, RankingModule, GameModule],
    controllers: [PlayerController, PlayerOfTheWeekController],
    providers: [PlayerService, PlayerOfTheWeekService],
    exports: [PlayerService, PlayerOfTheWeekService],
})
export class PlayerModule {}
