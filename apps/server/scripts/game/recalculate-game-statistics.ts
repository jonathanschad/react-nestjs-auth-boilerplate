import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { GameService } from '@/dart/game/game.service';

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    console.log('Starting game statistics recalculation...');

    const gameService = app.get(GameService);
    const result = await gameService.recalculateAllGameStatistics();

    console.log(`✅ Successfully recalculated statistics for ${result.recalculated} games`);
};
