import { z } from 'zod';
import { eloHistoryEntitySchema, openSkillHistoryEntitySchema } from './history';

// Enums
export const gameTypeSchema = z.enum(['X301', 'X501']);
export const gameCheckoutModeSchema = z.enum(['SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT']);

// Game Turn Entity
export const gameTurnEntitySchema = z.object({
    id: z.string().uuid(),
    playerId: z.string().uuid(),
    turnNumber: z.number().int().min(0),
    throw1: z.number().int().min(0).nullable(),
    throw1Multiplier: z.number().int().min(1).max(3).nullable(),
    throw2: z.number().int().min(0).max(25).nullable(),
    throw2Multiplier: z.number().int().min(1).max(3).nullable(),
    throw3: z.number().int().min(0).max(25).nullable(),
    throw3Multiplier: z.number().int().min(0).max(3).nullable(),
    totalScore: z.number().int(),
});

// Game Statistics Entity
export const gameStatisticsEntitySchema = z.object({
    id: z.string().uuid(),
    playerId: z.string().uuid(),
    wonBullOff: z.boolean(),
    averageScore: z.number(),
    averageUntilFirstPossibleFinish: z.number(),
    throwsOnDouble: z.number().int(),
});

// Game Player Entity (used in GameEntityApiDTO)
export const gamePlayerEntitySchema = z.object({
    id: z.string().uuid(),
    turns: z.array(gameTurnEntitySchema),
    gameStatistics: gameStatisticsEntitySchema.optional(),
    eloHistory: eloHistoryEntitySchema,
    openSkillHistory: openSkillHistoryEntitySchema,
});

// Game Entity
export const gameEntitySchema = z.object({
    id: z.string().uuid(),
    playerA: gamePlayerEntitySchema,
    playerB: gamePlayerEntitySchema,
    winnerId: z.string().uuid(),
    loserId: z.string().uuid(),
    gameStart: z.date(),
    gameEnd: z.date(),
    type: gameTypeSchema,
    checkoutMode: gameCheckoutModeSchema,
});

// Game Turn DTO (for creating games)
export const gameTurnDtoSchema = z.object({
    playerId: z.string().uuid(),
    turnNumber: z.number().int().min(0),
    throw1: z.number().int().min(0).nullable(),
    throw1Multiplier: z.number().int().min(1).max(3).nullable(),
    throw2: z.number().int().min(0).max(25).nullable(),
    throw2Multiplier: z.number().int().min(1).max(3).nullable(),
    throw3: z.number().int().min(0).max(25).nullable(),
    throw3Multiplier: z.number().int().min(0).max(3).nullable(),
});

// Create Game DTO
export const createGameSchema = z.object({
    playerAId: z.string().uuid(),
    playerBId: z.string().uuid(),
    winnerId: z.string().uuid(),
    gameStart: z.date(),
    gameEnd: z.date(),
    type: gameTypeSchema,
    checkoutMode: gameCheckoutModeSchema,
    turns: z.array(gameTurnDtoSchema),
});

// Game Preview Response
export const gamePreviewResponseSchema = z.object({
    playerA: z.object({
        id: z.string().uuid(),
        name: z.string(),
        elo: z.object({
            onWin: z.number(),
            onLoss: z.number(),
            current: z.number(),
        }),
    }),
    playerB: z.object({
        id: z.string().uuid(),
        name: z.string(),
        elo: z.object({
            onWin: z.number(),
            onLoss: z.number(),
            current: z.number(),
        }),
    }),
});

// Game Statistics Summary Response
export const gameStatisticsSummaryResponseSchema = z.object({
    averageScore: z.number(),
    averageUntilFirstPossibleFinish: z.number(),
    throwsOnDouble: z.number().int(),
    numberOfGames: z.number().int(),
});

export const gameFilterSchema = z.object({
    playerIds: z.array(z.string().uuid()).optional(),
    timeFrame: z
        .object({
            startDate: z.date().optional(),
            endDate: z.date().optional(),
        })
        .optional(),
    type: gameTypeSchema.optional(),
    checkoutMode: gameCheckoutModeSchema.optional(),
});

// Type exports
export type GameType = z.infer<typeof gameTypeSchema>;
export type GameCheckoutMode = z.infer<typeof gameCheckoutModeSchema>;
export type GameTurnEntityApiDTO = z.infer<typeof gameTurnEntitySchema>;
export type GameStatisticsEntityApiDTO = z.infer<typeof gameStatisticsEntitySchema>;
export type GameEntityApiDTO = z.infer<typeof gameEntitySchema>;
export type GameTurnDTO = z.infer<typeof gameTurnDtoSchema>;
export type CreateGameDTO = z.infer<typeof createGameSchema>;
export type GamePreviewResponseDTO = z.infer<typeof gamePreviewResponseSchema>;
export type GameStatisticsSummaryResponseDTO = z.infer<typeof gameStatisticsSummaryResponseSchema>;
export type GameFilter = z.infer<typeof gameFilterSchema>;
