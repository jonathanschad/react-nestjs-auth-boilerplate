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
    id: z.uuid(),
    name: z.string(),
    currentElo: z.number().nullable(),
    lastGamePlayedAt: z.string().nullable(),
    profilePictureId: z.string().nullable(),
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

export const playerSummaryStatsDetailsSchema = z.object({
    bullOffWins: z.number().int(),
    bullOffLosses: z.number().int(),
    bullOffWinRate: z.number(),
    averageScore: z.number(),
    averageUntilFirstPossibleFinish: z.number(),
    throwsOnDouble: z.number(),
});

export const playerSummaryStatsSchema = z.object({
    id: z.uuid(),
    details: playerSummaryStatsDetailsSchema.optional(),
    wins: z.number().int(),
    losses: z.number().int(),
    winRate: z.number(),
});

export const headToHeadStatsSchema = z.object({
    player: playerSummaryStatsSchema,
    opponent: playerSummaryStatsSchema,
    totalGames: z.number().int(),
});

// Player Opponents Response
export const playerOpponentsResponseSchema = z.array(headToHeadStatsSchema);

// Type exports
export type PlayerResponseDTO = z.infer<typeof playerResponseSchema>;
export type PlayerDetailsResponseDTO = z.infer<typeof playerDetailsResponseSchema>;
export type PlayerOpponentsResponseDTO = z.infer<typeof playerOpponentsResponseSchema>;
export type HeadToHeadStats = z.infer<typeof headToHeadStatsSchema>;
export type PlayerSummaryStats = z.infer<typeof playerSummaryStatsSchema>;
export type PlayerSummaryStatsDetails = z.infer<typeof playerSummaryStatsDetailsSchema>;
