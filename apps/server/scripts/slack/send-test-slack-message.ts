import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { RawServerDefault } from 'fastify';
import { GameResult } from '@/dart/ranking/ranking';
import { SlackService } from '@/slack/slack.service';

export const main = async (app: NestFastifyApplication<RawServerDefault>) => {
    const slackService = app.get(SlackService);
    await slackService.sendNewGameNotification({
        playerA: {
            name: 'Michael Haas',
            ratingBefore: 9,
            ratingAfter: 10,
        },
        playerB: {
            name: 'Hannibal Wissing',
            ratingBefore: 2,
            ratingAfter: 1,
        },
        result: GameResult.WIN_PLAYER_A,
    });
    await slackService.sendNewGameNotification({
        playerA: {
            name: 'Michael Haas',
            ratingBefore: 9,
            ratingAfter: 10,
        },
        playerB: {
            name: 'Hannibal Wissing',
            ratingBefore: 2,
            ratingAfter: 1,
        },
        result: GameResult.WIN_PLAYER_B,
    });
    await slackService.sendNewGameNotification({
        playerA: {
            name: 'Michael Haas',
            ratingBefore: null,
            ratingAfter: null,
        },
        playerB: {
            name: 'Hannibal Wissing',
            ratingBefore: null,
            ratingAfter: 1,
        },
        result: GameResult.WIN_PLAYER_B,
    });
};
