import { oc } from '@orpc/contract';
import { z } from 'zod';
import { playerOfTheWeekContenderSchema, playerOfTheWeekWithIdEntitySchema } from '../../schemas/player-of-the-week';

export const playerOfTheWeekContract = oc.prefix('/player-of-the-week').router({
    getCurrentContender: oc
        .route({ method: 'GET', path: '/current-contender' })
        .output(z.array(playerOfTheWeekContenderSchema)),
    getHistory: oc.route({ method: 'GET', path: '/history' }).output(z.array(playerOfTheWeekWithIdEntitySchema)),
    getDetails: oc
        .route({ method: 'GET', path: '/details/:id' })
        .input(z.object({ id: z.uuid() }))
        .output(
            z.object({
                winner: playerOfTheWeekWithIdEntitySchema,
                allContenders: z.array(playerOfTheWeekContenderSchema),
            }),
        ),
});
