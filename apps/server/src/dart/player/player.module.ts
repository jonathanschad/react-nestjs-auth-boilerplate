import { Module } from '@nestjs/common';
import { PlayerController } from '@/dart/player/player.controller';
import { PlayerService } from '@/dart/player/player.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [PlayerController],
    providers: [PlayerService],
    exports: [PlayerService],
})
export class PlayerModule {}
