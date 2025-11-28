import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { GameModule } from '@/dart/game/game.module';
import { DatabaseModule } from '@/database/database.module';
import { ImportGamesFromOldSystemService } from '@/import/import-games-from-old-system.service';

@Module({
    imports: [AppConfigModule, DatabaseModule, GameModule],
    providers: [ImportGamesFromOldSystemService],
    exports: [ImportGamesFromOldSystemService],
})
export class ImportModule {}
