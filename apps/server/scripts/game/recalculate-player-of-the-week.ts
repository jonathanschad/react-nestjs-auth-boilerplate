import { NestFastifyApplication } from '@nestjs/platform-fastify';
import dayjs from 'dayjs';
import { RawServerDefault } from 'fastify';
import { PlayerOfTheWeekService } from '@/dart/player/player-of-the-week.service';
import { PrismaService } from '@/database/prisma.service';

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    console.log('Starting game statistics recalculation...');

    const prisma = app.get(PrismaService);
    const playerOfTheWeekService = app.get(PlayerOfTheWeekService);

    const firstGame = await prisma.game.findFirstOrThrow({
        orderBy: {
            gameStart: 'asc',
        },
    });
    const firstWeekStart = dayjs(firstGame.gameStart).startOf('week');
    const lastWeekStart = dayjs().subtract(1, 'week').startOf('week');

    let loopWeekStart = firstWeekStart;
    while (!loopWeekStart.isAfter(lastWeekStart)) {
        console.log(`Creating player of the week for week ${loopWeekStart.format('YYYY-MM-DD')}`);
        await playerOfTheWeekService.upsertPlayerOfTheWeek({
            weekStart: loopWeekStart.toDate(),
            postSendSlackMessage: false,
        });
        loopWeekStart = loopWeekStart.add(1, 'week');
    }

    console.log('✅ Successfully recalculated player of the week');
};
