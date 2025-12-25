import { api } from '@boilerplate/types';
import { Controller } from '@nestjs/common';
import { Implement, implement } from '@orpc/nest';
import { PlayerOfTheWeekService } from '@/dart/player/player-of-the-week.service';

@Controller()
export class PlayerOfTheWeekController {
    constructor(private readonly playerOfTheWeekService: PlayerOfTheWeekService) {}

    @Implement(api.dart.playerOfTheWeek.getCurrentContender)
    public async getCurrentPlayerOfTheWeekContender() {
        return implement(api.dart.playerOfTheWeek.getCurrentContender).handler(async () => {
            const result = await this.playerOfTheWeekService.getCurrentPlayerOfTheWeekContender();
            return result.map((item) => ({
                playerId: item.playerId,
                weekStart: item.weekStart.toISOString(),
                eloDifference: item.eloDifference,
                openSkillDifference: item.openSkillDifference,
                averageScore: item.averageScore,
                scoringAverage: item.scoringAverage,
                numberOfGames: item.numberOfGames,
            }));
        });
    }

    @Implement(api.dart.playerOfTheWeek.getHistory)
    public async getPlayerOfTheWeekHistory() {
        return implement(api.dart.playerOfTheWeek.getHistory).handler(async () => {
            const result = await this.playerOfTheWeekService.getPlayerOfTheWeekHistory();
            return result.map((item) => ({
                id: item.id,
                playerId: item.playerId,
                weekStart: item.weekStart.toISOString(),
                eloDifference: item.eloDifference,
                openSkillDifference: item.openSkillDifference,
                averageScore: item.averageScore,
                scoringAverage: item.scoringAverage,
                numberOfGames: item.numberOfGames,
            }));
        });
    }

    @Implement(api.dart.playerOfTheWeek.getDetails)
    public async getPlayerOfTheWeekDetails() {
        return implement(api.dart.playerOfTheWeek.getDetails).handler(async ({ input }) => {
            const result = await this.playerOfTheWeekService.getPlayerOfTheWeekDetails({ id: input.id });
            if (!result) {
                throw new Error('Player of the week not found');
            }

            return {
                winner: {
                    id: result.winner.id,
                    playerId: result.winner.playerId,
                    weekStart: result.winner.weekStart.toISOString(),
                    eloDifference: result.winner.eloDifference,
                    openSkillDifference: result.winner.openSkillDifference,
                    averageScore: result.winner.averageScore,
                    scoringAverage: result.winner.scoringAverage,
                    numberOfGames: result.winner.numberOfGames,
                },
                allContenders: result.allContenders.map((item) => ({
                    playerId: item.playerId,
                    weekStart: item.weekStart.toISOString(),
                    eloDifference: item.eloDifference,
                    openSkillDifference: item.openSkillDifference,
                    averageScore: item.averageScore,
                    scoringAverage: item.scoringAverage,
                    numberOfGames: item.numberOfGames,
                })),
            };
        });
    }
}
