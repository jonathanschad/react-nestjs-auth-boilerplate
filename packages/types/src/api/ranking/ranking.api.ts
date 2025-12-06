import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { eloRankingResponseSchema, openSkillRankingResponseSchema } from '../../schemas';

const c = initContract();

export const rankingsContract = c.router({
    elo: {
        method: 'GET',
        path: '/dart/rankings/elo',
        responses: {
            200: z.array(eloRankingResponseSchema),
        },
        query: z.object({}),
        summary: 'Get ELO rankings',
    },
    openskill: {
        method: 'GET',
        path: '/dart/rankings/openskill',
        responses: {
            200: z.array(openSkillRankingResponseSchema),
        },
        query: z.object({}),
        summary: 'Get OpenSkill rankings',
    },
});
