import { z } from 'zod';
import { openskillRatingSchema } from './history';
import { eloRatingSchema } from './ranking';
import { publicUserSchema } from './user';

// Ranking Cache
export const rankingCacheSchema = <T extends z.ZodType>(ratingSchema: T) =>
    z.object({
        rating: ratingSchema,
        rank: z.number().int().nullable(),
    });

// Player Response
export const playerResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    currentElo: z.number().nullable(),
    lastGamePlayedAt: z.string().nullable(),
});

// Player Details Response
export const playerDetailsResponseSchema = z.object({
    player: publicUserSchema,
    currentRating: z.object({
        elo: z.object({
            rating: eloRatingSchema,
            rank: z.number().int().nullable(),
        }),
        openSkill: z.object({
            rating: openskillRatingSchema,
            rank: z.number().int().nullable(),
        }),
    }),
    stats: z.object({
        gamesPlayed: z.number().int(),
        wins: z.number().int(),
        losses: z.number().int(),
        winRate: z.number(),
        lastGamePlayedAt: z.string().nullable(),
    }),
});

// Player Opponents Response
export const playerOpponentsResponseSchema = z.array(
    z.object({
        opponentId: z.string().uuid(),
    }),
);

// Type exports
export type PlayerResponseDTO = z.infer<typeof playerResponseSchema>;
export type PlayerDetailsResponseDTO = z.infer<typeof playerDetailsResponseSchema>;
export type PlayerOpponentsResponseDTO = z.infer<typeof playerOpponentsResponseSchema>;
