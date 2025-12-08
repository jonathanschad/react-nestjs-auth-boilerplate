import { Module } from '@nestjs/common';
import { GameController } from '@/dart/game/game.controller';
import { GameService } from '@/dart/game/game.service';
import { RankingModule } from '@/dart/ranking/ranking.module';
import { DatabaseModule } from '@/database/database.module';
import { SlackModule } from '@/slack/slack.module';

@Module({
    imports: [DatabaseModule, RankingModule, SlackModule],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {}
