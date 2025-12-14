import { oc } from '@orpc/contract';
import { z } from 'zod';
import { playerOfTheWeekEntitySchema } from '../../schemas/player-of-the-week';

export const playerOfTheWeekContract = oc.prefix('/player-of-the-week').router({
    getCurrentContender: oc
        .route({ method: 'GET', path: '/current-contender' })
        .output(z.array(playerOfTheWeekEntitySchema)),
    getHistory: oc.route({ method: 'GET', path: '/history' }).output(z.array(playerOfTheWeekEntitySchema)),
});
