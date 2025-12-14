import { NestFastifyApplication } from '@nestjs/platform-fastify';
import dayjs from 'dayjs';
import { RawServerDefault } from 'fastify';
import { PlayerOfTheWeekService } from '@/dart/player/player-of-the-week.service';

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    console.log('Starting player of the week calculation...');

    const playerOfTheWeekService = app.get(PlayerOfTheWeekService);

    const weekStart = dayjs().subtract(1, 'week').startOf('week');
    await playerOfTheWeekService.upsertPlayerOfTheWeek({
        weekStart: weekStart.toDate(),
        postSendSlackMessage: false,
    });

    console.log('✅ Successfully calculated player of the week');
};
