import { Module } from '@nestjs/common';
import { GameController } from '@/dart/game/game.controller';
import { GameService } from '@/dart/game/game.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {}
