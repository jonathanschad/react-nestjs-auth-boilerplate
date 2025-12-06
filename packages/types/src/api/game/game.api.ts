import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
    createGameSchema,
    gameEntitySchema,
    gamePreviewResponseSchema,
    paginatedResponseSchema,
    paginationSchema,
} from '../../schemas';

const c = initContract();

export const gameContract = c.router({
    createGame: {
        method: 'PUT',
        path: '/dart/game/:uuid',
        responses: {
            200: z.void(),
            400: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            uuid: z.string().uuid(),
        }),
        body: createGameSchema,
        summary: 'Create a new game',
    },
    getGamePreview: {
        method: 'GET',
        path: '/dart/game/preview/playerA/:playerAId/playerB/:playerBId',
        responses: {
            200: gamePreviewResponseSchema,
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            playerAId: z.string().uuid(),
            playerBId: z.string().uuid(),
        }),
        summary: 'Get game preview for two players',
    },
    getGames: {
        method: 'GET',
        path: '/dart/game',
        responses: {
            200: paginatedResponseSchema(gameEntitySchema),
        },
        query: paginationSchema.extend({
            playerIds: z.array(z.string().uuid()).optional(),
            startDate: z.string().datetime().optional(),
            endDate: z.string().datetime().optional(),
            type: z.enum(['X301', 'X501']).optional(),
            checkoutMode: z.enum(['SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT']).optional(),
        }),
        summary: 'Get games with optional filters',
    },
});
