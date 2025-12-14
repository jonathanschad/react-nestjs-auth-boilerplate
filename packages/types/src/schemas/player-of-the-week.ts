import z from 'zod';

export const playerOfTheWeekEntitySchema = z.object({
    playerId: z.uuid(),
    weekStart: z.iso.datetime(),
    eloDifference: z.number(),
    openSkillDifference: z.number(),
    averageScore: z.number(),
    scoringAverage: z.number(),
    numberOfGames: z.number(),
});

export type PlayerOfTheWeekEntityDTO = z.infer<typeof playerOfTheWeekEntitySchema>;
