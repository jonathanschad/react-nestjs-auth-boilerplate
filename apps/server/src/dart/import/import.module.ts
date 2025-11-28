import { Module } from '@nestjs/common';
import { AppConfigModule } from '@/config/app-config.module';
import { GameModule } from '@/dart/game/game.module';
import { ImportGamesFromOldSystemService } from '@/dart/import/import-games-from-old-system.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
    imports: [AppConfigModule, DatabaseModule, GameModule],
    providers: [ImportGamesFromOldSystemService],
    exports: [ImportGamesFromOldSystemService],
})
export class ImportModule {}
