import { z } from 'zod';

// Elo History Entity
export const eloHistoryEntitySchema = z.object({
    id: z.uuid(),
    gameId: z.uuid(),
    playerId: z.uuid(),
    eloBefore: z.number(),
    eloAfter: z.number(),
    gamesPlayedBefore: z.number().int(),
    gamesPlayedAfter: z.number().int(),
});

// Rating type (using for OpenSkill)
export const openskillRatingSchema = z.object({
    mu: z.number(),
    sigma: z.number(),
});

// OpenSkill History Entity
export const openSkillHistoryEntitySchema = z.object({
    id: z.uuid(),
    gameId: z.uuid(),
    playerId: z.uuid(),
    muBefore: z.number(),
    muAfter: z.number(),
    sigmaBefore: z.number(),
    sigmaAfter: z.number(),
    ordinalBefore: z.number(),
    ordinalAfter: z.number(),
});

// Elo History Response with timestamp (for charts/history display)
export const eloHistoryResponseSchema = z.object({
    id: z.uuid(),
    timestamp: z.string().datetime(),
    eloBefore: z.number(),
    eloAfter: z.number(),
    eloChange: z.number(),
    gamesPlayedAfter: z.number().int(),
});

// Type exports
export type EloHistoryEntityApiDTO = z.infer<typeof eloHistoryEntitySchema>;
export type EloHistoryResponseDTO = z.infer<typeof eloHistoryResponseSchema>;
export type OpenSkillHistoryEntityApiDTO = z.infer<typeof openSkillHistoryEntitySchema>;
export type OpenSkillRating = z.infer<typeof openskillRatingSchema>;
