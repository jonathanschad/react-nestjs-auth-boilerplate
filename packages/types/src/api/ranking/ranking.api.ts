import { oc } from '@orpc/contract';
import { z } from 'zod';
import { eloRankingResponseSchema, openSkillRankingResponseSchema } from '../../schemas';

export const rankingsContract = oc.prefix('/rankings').router({
    elo: oc.route({ method: 'GET', path: '/elo' }).input(z.object({})).output(z.array(eloRankingResponseSchema)),
    openskill: oc
        .route({ method: 'GET', path: '/openskill' })
        .input(z.object({}))
        .output(z.array(openSkillRankingResponseSchema)),
});
