import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { ImportGamesFromOldSystemService } from '@/import/import-games-from-old-system.service';

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    const importGamesFromOldSystemService = app.get(ImportGamesFromOldSystemService);
    await importGamesFromOldSystemService.importGamesFromOldSystem();
};
