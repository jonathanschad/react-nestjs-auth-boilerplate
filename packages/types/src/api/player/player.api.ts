import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
    eloRankingResponseSchema,
    gameEntitySchema,
    openSkillRankingResponseSchema,
    paginatedResponseSchema,
    paginationSchema,
    playerDetailsResponseSchema,
    playerOpponentsResponseSchema,
    playerResponseSchema,
} from '../../schemas';

const c = initContract();

export const playerContract = c.router({
    getAll: {
        method: 'GET',
        path: '/dart/player',
        responses: {
            200: z.array(playerResponseSchema),
        },
        query: z.object({}),
        summary: 'Get all players',
    },
    getDetails: {
        method: 'GET',
        path: '/dart/player/:playerId',
        responses: {
            200: playerDetailsResponseSchema,
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            playerId: z.string().uuid(),
        }),
        summary: 'Get player details',
    },
    getGames: {
        method: 'GET',
        path: '/dart/player/:playerId/games',
        responses: {
            200: paginatedResponseSchema(gameEntitySchema),
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            playerId: z.string().uuid(),
        }),
        query: paginationSchema,
        summary: 'Get player games with pagination',
    },
    getEloHistory: {
        method: 'GET',
        path: '/dart/player/:userId/elo-history',
        responses: {
            200: z.array(eloRankingResponseSchema),
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            userId: z.string().uuid(),
        }),
        summary: 'Get player ELO history',
    },
    getOpenSkillHistory: {
        method: 'GET',
        path: '/dart/player/:userId/openskill-history',
        responses: {
            200: z.array(openSkillRankingResponseSchema),
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            userId: z.string().uuid(),
        }),
        summary: 'Get player OpenSkill history',
    },
    getOpponents: {
        method: 'GET',
        path: '/dart/player/:playerId/opponents',
        responses: {
            200: playerOpponentsResponseSchema,
            404: z.object({ message: z.string() }),
        },
        pathParams: z.object({
            playerId: z.string().uuid(),
        }),
        summary: 'Get player opponents',
    },
});
