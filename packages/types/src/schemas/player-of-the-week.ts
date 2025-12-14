import z from 'zod';

export const playerOfTheWeekEntitySchema = z.object({
    id: z.uuid().optional(),
    playerId: z.uuid(),
    weekStart: z.iso.datetime(),
    eloDifference: z.number(),
    openSkillDifference: z.number(),
    averageScore: z.number(),
    scoringAverage: z.number(),
    numberOfGames: z.number(),
});

export const playerOfTheWeekWithIdEntitySchema = playerOfTheWeekEntitySchema.extend({
    id: z.uuid(),
});

export const playerOfTheWeekContenderSchema = playerOfTheWeekEntitySchema.omit({ id: true });

export type PlayerOfTheWeekEntityDTO = z.infer<typeof playerOfTheWeekEntitySchema>;
export type PlayerOfTheWeekWithIdEntityDTO = z.infer<typeof playerOfTheWeekWithIdEntitySchema>;
export type PlayerOfTheWeekContenderDTO = z.infer<typeof playerOfTheWeekContenderSchema>;
