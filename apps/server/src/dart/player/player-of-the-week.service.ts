import { PlayerOfTheWeek } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { rating } from 'openskill';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { PlayerOfTheWeekDatabaseService } from '@/database/game/player-of-the-week.service';
import { DatabaseUserService } from '@/database/user/user.service';
import { SlackService } from '@/slack/slack.service';

export type PlayerOfTheWeekData = Omit<PlayerOfTheWeek, 'id' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class PlayerOfTheWeekService {
    constructor(
        private readonly gameService: DatabaseGameService,
        private readonly openSkillService: OpenSkillService,
        private readonly playerOfTheWeekDatabaseService: PlayerOfTheWeekDatabaseService,
        private readonly userDatabaseService: DatabaseUserService,
        private readonly slackService: SlackService,
    ) {}

    private async calculatePlayerOfTheWeek(weekStartParam?: Date): Promise<Record<string, PlayerOfTheWeekData>> {
        const weekStart = weekStartParam ? dayjs(weekStartParam).startOf('week') : dayjs().startOf('week');
        const weekEnd = weekStart.endOf('week');

        const games = await this.gameService.getGames({
            filter: { timeFrame: { startDate: weekStart.toISOString(), endDate: weekEnd.toISOString() } },
        });

        const playerEloChange: Record<string, PlayerOfTheWeekData> = {};

        const eloHistories = games.flatMap((game) => game.eloHistory);
        for (const eloHistory of eloHistories) {
            if (!playerEloChange[eloHistory.playerId]) {
                playerEloChange[eloHistory.playerId] = {
                    playerId: eloHistory.playerId,
                    weekStart: weekStart.toDate(),
                    eloDifference: 0,
                    openSkillDifference: 0,
                    averageScore: 0,
                    scoringAverage: 0,
                    numberOfGames: 0,
                };
            }
            playerEloChange[eloHistory.playerId].eloDifference += eloHistory.eloAfter - eloHistory.eloBefore;
            playerEloChange[eloHistory.playerId].numberOfGames++;
        }

        const openSkillHistories = games.flatMap((game) => game.openSkillHistory);
        for (const openSkillHistory of openSkillHistories) {
            const openSkillAfter = rating({ mu: openSkillHistory.muAfter, sigma: openSkillHistory.sigmaAfter });
            const openSkillBefore = rating({ mu: openSkillHistory.muBefore, sigma: openSkillHistory.sigmaBefore });

            playerEloChange[openSkillHistory.playerId].openSkillDifference +=
                this.openSkillService.formatRatingIntoScore(openSkillAfter) -
                this.openSkillService.formatRatingIntoScore(openSkillBefore);
        }

        const gameStatistics = games.flatMap((game) => game.gameStatistics);
        for (const playerGameStatistics of gameStatistics) {
            playerEloChange[playerGameStatistics.playerId].averageScore += playerGameStatistics.averageScore;
            playerEloChange[playerGameStatistics.playerId].scoringAverage +=
                playerGameStatistics.averageUntilFirstPossibleFinish;
        }
        for (const playerId in playerEloChange) {
            playerEloChange[playerId].averageScore /= playerEloChange[playerId].numberOfGames;
            playerEloChange[playerId].scoringAverage /= playerEloChange[playerId].numberOfGames;
        }

        return playerEloChange;
    }

    public async getCurrentPlayerOfTheWeekContender(): Promise<Array<PlayerOfTheWeekData>> {
        const playerOfTheWeekData = await this.calculatePlayerOfTheWeek();
        const sortedPlayerOfTheWeekData = Object.values(playerOfTheWeekData).sort(
            (a, b) => b.eloDifference - a.eloDifference,
        );

        return sortedPlayerOfTheWeekData.map((item) => ({
            id: '',
            ...item,
        }));
    }

    public async upsertPlayerOfTheWeek({
        weekStart,
        postSendSlackMessage,
    }: {
        weekStart?: Date;
        postSendSlackMessage?: boolean;
    }): Promise<void> {
        const playerOfTheWeekData = await this.calculatePlayerOfTheWeek(weekStart);

        const sortedPlayerOfTheWeekData = Object.values(playerOfTheWeekData).sort(
            (a, b) => b.eloDifference - a.eloDifference,
        );

        if (sortedPlayerOfTheWeekData.length === 0) {
            return;
        }

        const playerOfTheWeek = sortedPlayerOfTheWeekData[0];
        await this.playerOfTheWeekDatabaseService.upsertPlayerOfTheWeek({
            weekStart: dayjs(weekStart).startOf('week').toDate(),
            eloDifference: playerOfTheWeek.eloDifference,
            openSkillDifference: playerOfTheWeek.openSkillDifference,
            averageScore: playerOfTheWeek.averageScore,
            scoringAverage: playerOfTheWeek.scoringAverage,
            numberOfGames: playerOfTheWeek.numberOfGames,
            playerId: playerOfTheWeek.playerId,
        });

        if (postSendSlackMessage) {
            const players = await this.userDatabaseService.findMany({
                id: {
                    in: Object.keys(playerOfTheWeekData),
                },
            });

            await this.slackService.newPlayerOfTheWeekNotification({
                players,
                playerOfTheWeekData: sortedPlayerOfTheWeekData,
            });
        }
    }

    public async getPlayerOfTheWeekHistory(): Promise<Array<PlayerOfTheWeek>> {
        return this.playerOfTheWeekDatabaseService.getPlayerOfTheWeekHistory();
    }

    public async getPlayerOfTheWeekDetails({ id }: { id: string }): Promise<{
        winner: PlayerOfTheWeek;
        allContenders: Array<PlayerOfTheWeekData>;
    } | null> {
        const winner = await this.playerOfTheWeekDatabaseService.getPlayerOfTheWeekById({ id });
        if (!winner) {
            return null;
        }

        const allContendersMap = await this.calculatePlayerOfTheWeek(winner.weekStart);
        const allContenders = Object.values(allContendersMap).sort((a, b) => b.eloDifference - a.eloDifference);

        return {
            winner,
            allContenders,
        };
    }
}
