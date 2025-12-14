import { oc } from '@orpc/contract';
import { z } from 'zod';
import {
    averageHistoryResponseSchema,
    eloHistoryResponseSchema,
    gameEntitySchema,
    openSkillRankingResponseSchema,
    paginatedResponseSchema,
    paginationSchema,
    playerDetailsResponseSchema,
    playerOpponentsResponseSchema,
    playerResponseSchema,
} from '../../schemas';

export const playerContract = oc.prefix('/player').router({
    getAll: oc.route({ method: 'GET', path: '/' }).input(z.object({})).output(z.array(playerResponseSchema)),
    getDetails: oc
        .route({ method: 'GET', path: '/{playerId}' })
        .input(
            z.object({
                playerId: z.uuid(),
            }),
        )
        .output(playerDetailsResponseSchema),
    getGames: oc
        .route({ method: 'GET', path: '/{playerId}/games' })
        .input(
            z
                .object({
                    playerId: z.uuid(),
                })
                .merge(paginationSchema),
        )
        .output(paginatedResponseSchema(gameEntitySchema)),
    getEloHistory: oc
        .route({ method: 'GET', path: '/{userId}/elo-history' })
        .input(
            z.object({
                userId: z.uuid(),
            }),
        )
        .output(z.array(eloHistoryResponseSchema)),
    getOpenSkillHistory: oc
        .route({ method: 'GET', path: '/{userId}/openskill-history' })
        .input(
            z.object({
                userId: z.uuid(),
            }),
        )
        .output(z.array(openSkillRankingResponseSchema)),
    getAverageHistory: oc
        .route({ method: 'GET', path: '/{userId}/average-history' })
        .input(
            z.object({
                userId: z.uuid(),
            }),
        )
        .output(averageHistoryResponseSchema),
    getOpponentsWithHeadToHead: oc
        .route({ method: 'GET', path: '/{playerId}/opponents' })
        .input(
            z.object({
                playerId: z.uuid(),
            }),
        )
        .output(playerOpponentsResponseSchema),
});
