import { z } from 'zod';
import { eloHistoryEntitySchema, openSkillHistoryEntitySchema } from './history';

// Enums
export const gameTypeSchema = z.enum(['X301', 'X501']);
export const gameCheckoutModeSchema = z.enum(['SINGLE_OUT', 'DOUBLE_OUT', 'MASTER_OUT']);
export const gameVisitOutcomeSchema = z.enum(['BUSTED', 'HIT', 'MISS']);

// Game Visit Entity
export const gameVisitEntitySchema = z.object({
    id: z.uuid(),
    playerId: z.uuid(),
    visitNumber: z.number().int().min(0),
    throw1: z.number().int().min(0).nullable(),
    throw1Multiplier: z.number().int().min(1).max(3).nullable(),
    throw2: z.number().int().min(0).max(25).nullable(),
    throw2Multiplier: z.number().int().min(1).max(3).nullable(),
    throw3: z.number().int().min(0).max(25).nullable(),
    throw3Multiplier: z.number().int().min(0).max(3).nullable(),
    totalScored: z.number().int(),
    remainingScoreBefore: z.number().int(),
    remainingScoreAfter: z.number().int(),
    outcome: gameVisitOutcomeSchema,
});

// Game Statistics Entity
export const gameStatisticsEntitySchema = z.object({
    id: z.uuid(),
    playerId: z.uuid(),
    wonBullOff: z.boolean(),
    averageScore: z.number(),
    averageUntilFirstPossibleFinish: z.number(),
    throwsOnDouble: z.number().int(),
});

// Game Player Entity (used in GameEntityApiDTO)
export const gamePlayerEntitySchema = z.object({
    id: z.uuid(),
    visits: z.array(gameVisitEntitySchema),
    gameStatistics: gameStatisticsEntitySchema.optional(),
    eloHistory: eloHistoryEntitySchema,
    openSkillHistory: openSkillHistoryEntitySchema,
});

// Game Entity
export const gameEntitySchema = z.object({
    id: z.uuid(),
    playerA: gamePlayerEntitySchema,
    playerB: gamePlayerEntitySchema,
    winnerId: z.uuid(),
    loserId: z.uuid(),
    gameStart: z.iso.datetime(),
    gameEnd: z.iso.datetime(),
    type: gameTypeSchema,
    checkoutMode: gameCheckoutModeSchema,
});

// Game Visit DTO (for creating games)
export const gameVisitCreateDtoSchema = z.object({
    playerId: z.uuid(),
    visitNumber: z.number().int().min(0),
    throw1: z.number().int().min(0).nullable(),
    throw1Multiplier: z.number().int().min(1).max(3).nullable(),
    throw2: z.number().int().min(0).max(25).nullable(),
    throw2Multiplier: z.number().int().min(1).max(3).nullable(),
    throw3: z.number().int().min(0).max(25).nullable(),
    throw3Multiplier: z.number().int().min(0).max(3).nullable(),
});

// Create Game DTO
export const createGameSchema = z.object({
    playerAId: z.uuid(),
    playerBId: z.uuid(),
    winnerId: z.uuid(),
    gameStart: z.iso.datetime(),
    gameEnd: z.iso.datetime(),
    type: gameTypeSchema,
    checkoutMode: gameCheckoutModeSchema,
    visits: z.array(gameVisitCreateDtoSchema),
});

// Game Preview Response
export const gamePreviewResponseSchema = z.object({
    playerA: z.object({
        id: z.uuid(),
        name: z.string(),
        elo: z.object({
            onWin: z.number(),
            onLoss: z.number(),
            current: z.number(),
        }),
    }),
    playerB: z.object({
        id: z.uuid(),
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
    // [playerId1, playerId2], [playerId3, playerId4], ...
    playerIds: z.array(z.tuple([z.uuid(), z.uuid().optional()])).optional(),
    timeFrame: z
        .object({
            startDate: z.iso.datetime().optional(),
            endDate: z.iso.datetime().optional(),
        })
        .optional(),
    type: gameTypeSchema.optional(),
    checkoutMode: gameCheckoutModeSchema.optional(),
});

// Type exports
export type GameType = z.infer<typeof gameTypeSchema>;
export type GameCheckoutMode = z.infer<typeof gameCheckoutModeSchema>;
export type GameVisitOutcome = z.infer<typeof gameVisitOutcomeSchema>;
export type GameVisitEntityApiDTO = z.infer<typeof gameVisitEntitySchema>;
export type GameStatisticsEntityApiDTO = z.infer<typeof gameStatisticsEntitySchema>;
export type GameEntityApiDTO = z.infer<typeof gameEntitySchema>;
export type GameVisitCreateDTO = z.infer<typeof gameVisitCreateDtoSchema>;
export type CreateGameDTO = z.infer<typeof createGameSchema>;
export type GamePreviewResponseDTO = z.infer<typeof gamePreviewResponseSchema>;
export type GameStatisticsSummaryResponseDTO = z.infer<typeof gameStatisticsSummaryResponseSchema>;
export type GameFilter = z.infer<typeof gameFilterSchema>;
