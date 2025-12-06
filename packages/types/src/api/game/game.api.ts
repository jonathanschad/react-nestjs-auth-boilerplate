import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
    createGameSchema,
    gameEntitySchema,
    gamePreviewResponseSchema,
    paginatedResponseSchema,
    paginationSchema,
} from '../../schemas';

export const gameContract = oc.prefix('/game').router({
    createGame: oc
        .route({ method: 'PUT', path: '/{uuid}', inputStructure: 'detailed' })
        .input(
            z.object({
                body: createGameSchema,
                path: z.object({
                    uuid: z.string().uuid(),
                }),
            }),
        )
        .output(z.void()),
    getGamePreview: oc
        .route({ method: 'GET', path: '/preview/playerA/{playerAId}/playerB/{playerBId}' })
        .input(
            z.object({
                playerAId: z.string().uuid(),
                playerBId: z.string().uuid(),
            }),
        )
        .output(gamePreviewResponseSchema),
    getGames: oc
        .route({ method: 'GET', path: '/' })
        .input(
            paginationSchema.extend({
                playerIds: z.array(z.string().uuid()).optional(),
                startDate: z.string().datetime().optional(),
                endDate: z.string().datetime().optional(),
                type: z.enum(['X301', 'X501']).optional(),
                checkoutMode: z.enum(['SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT']).optional(),
            }),
        )
        .output(paginatedResponseSchema(gameEntitySchema)),
});
