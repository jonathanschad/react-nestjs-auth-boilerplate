import { z } from 'zod';
import { OpenSkillRating, openskillRatingSchema } from './history';

// Elo Rating
export const eloRatingSchema = z.object({
    elo: z.number(),
    gamesPlayed: z.number().int(),
});

// Elo Ranking Response
export const eloRankingResponseSchema = z.object({
    userId: z.uuid(),
    rank: z.number().int(),
    score: z.number(),
    rating: eloRatingSchema,
    gamesPlayed: z.number().int(),
});

// OpenSkill Ranking Response
export const openSkillRankingResponseSchema = z.object({
    userId: z.uuid(),
    rank: z.number().int(),
    score: z.number(),
    rating: openskillRatingSchema,
});

export type RankingCache<T extends EloRating | OpenSkillRating> = {
    rating: T;
    rank: number | null;
};

// Type exports
export type EloRating = z.infer<typeof eloRatingSchema>;
export type EloRankingResponseDTO = z.infer<typeof eloRankingResponseSchema>;
export type OpenSkillRankingResponseDTO = z.infer<typeof openSkillRankingResponseSchema>;
