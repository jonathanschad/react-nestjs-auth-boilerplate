import type {
    AverageHistoryResponseDTO,
    AverageObjectDTO,
    EloHistoryResponseDTO,
    GameEntityApiDTO,
    HeadToHeadStats,
    Pagination,
    PlayerDetailsResponseDTO,
    PlayerResponseDTO,
    PlayerSummaryStatsDetails,
} from '@boilerplate/types';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { RankingService } from '@/dart/ranking/ranking.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseGameStatisticService } from '@/database/game/game-statistic.service';
import { PlayerOfTheWeekDatabaseService } from '@/database/game/player-of-the-week.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class PlayerService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseGameStatisticService: DatabaseGameStatisticService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly rankingService: RankingService,
        private readonly playerOfTheWeekDatabaseService: PlayerOfTheWeekDatabaseService,
    ) {}

    async getAllPlayers(): Promise<PlayerResponseDTO[]> {
        const users = await this.databaseUserService.findAll();

        const playerResponse: PlayerResponseDTO[] = [];

        for (const user of users) {
            const mostRecentGame = await this.databaseGameService.getMostRecentGameByUserId(user.id);
            const currentUserElo = await this.databaseEloHistoryService.getCurrentRatingByUserId(user.id);
            const currentUserEloRating = this.databaseEloHistoryService.getRatingFromHistoryEntry(currentUserElo);
            playerResponse.push({
                id: user.id,
                name: user.name ?? '',
                currentElo: currentUserEloRating.elo,
                lastGamePlayedAt: mostRecentGame?.gameStart?.toISOString() ?? null,
                profilePictureId: user.profilePictureId,
                gamesPlayed: currentUserEloRating.gamesPlayed,
            });
        }

        return playerResponse;
    }

    async getPlayerDetails(playerId: string): Promise<PlayerDetailsResponseDTO> {
        const user = await this.databaseUserService.findByUuid(playerId);

        // TODO: Improve this
        const games = await this.databaseGameService.getGamesByUserId(playerId);
        const gamesPlayed = games.length;
        const mostRecentGame = games.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

        // Calculate win/loss record
        const wins = games.filter((game) => game.winnerId === playerId).length;
        const losses = gamesPlayed - wins;

        // Get player of the week wins count
        const playerOfTheWeekWins = await this.playerOfTheWeekDatabaseService.getPlayerOfTheWeekWinsCount(playerId);

        const cachedEloRating = await this.rankingService.getCachedEloRanking(playerId);
        const cachedOpenSkillRating = await this.rankingService.getCachedOpenSkillRanking(playerId);

        return {
            player: {
                id: user.id,
                name: user.name ?? '',
                profilePictureId: user.profilePictureId,
            },
            currentRating: {
                elo: cachedEloRating,
                openSkill: cachedOpenSkillRating,
            },
            stats: {
                gamesPlayed,
                wins,
                losses,
                winRate: gamesPlayed > 0 ? wins / gamesPlayed : 0,
                lastGamePlayedAt: mostRecentGame?.gameEnd.toISOString() ?? null,
                playerOfTheWeekWins,
            },
        };
    }

    async getPlayerGames(playerId: string, pagination: Pagination): Promise<GameEntityApiDTO[]> {
        const games = await this.databaseGameService.getGamesByUserIdPaginated(playerId, pagination);

        const gamesDto = games.map((game) => this.databaseGameService.mapGameToDTO(game));

        return gamesDto;
    }

    public async getPlayerOpponentsWithHeadToHead(playerId: string): Promise<HeadToHeadStats[]> {
        const opponents = await this.databaseGameService.getOpponentsByUserId(playerId);

        const headToHeadStats: HeadToHeadStats[] = [];

        for (const opponent of opponents) {
            const games = await this.databaseGameService.getGames({ filter: { playerIds: [[playerId, opponent]] } });

            const playerStats = games
                .map((game) => game.gameStatistics.find((stat) => stat.playerId === playerId))
                .filter((stat) => stat !== undefined);
            const opponentStats = games
                .map((game) => game.gameStatistics.find((stat) => stat.playerId === opponent))
                .filter((stat) => stat !== undefined);

            const totalGames = games.length;

            const wins = games.filter((game) => game.winnerId === playerId).length;
            const losses = games.filter((game) => game.loserId === playerId).length;
            const winRate = totalGames > 0 ? wins / totalGames : 0;

            const playerDetails: Partial<PlayerSummaryStatsDetails> = {};
            const opponentDetails: Partial<PlayerSummaryStatsDetails> = {};

            if (playerStats) {
                playerDetails.bullOffWins = playerStats.filter((stat) => stat.wonBullOff).length;
                playerDetails.bullOffLosses = playerStats.filter((stat) => !stat.wonBullOff).length;
                playerDetails.bullOffWinRate = totalGames > 0 ? playerDetails.bullOffWins / totalGames : 0;

                playerDetails.averageScore =
                    playerStats.reduce((acc, stat) => acc + stat.averageScore, 0) / playerStats.length;
                playerDetails.averageUntilFirstPossibleFinish =
                    playerStats.reduce((acc, stat) => acc + stat.averageUntilFirstPossibleFinish, 0) /
                    playerStats.length;
                playerDetails.throwsOnDouble =
                    playerStats.reduce((acc, stat) => acc + stat.throwsOnDouble, 0) / playerStats.length;
            }

            if (opponentStats) {
                opponentDetails.bullOffWins = opponentStats.filter((stat) => stat.wonBullOff).length;
                opponentDetails.bullOffLosses = opponentStats.filter((stat) => !stat.wonBullOff).length;
                opponentDetails.bullOffWinRate = totalGames > 0 ? opponentDetails.bullOffWins / totalGames : 0;

                opponentDetails.averageScore =
                    opponentStats.reduce((acc, stat) => acc + stat.averageScore, 0) / opponentStats.length;
                opponentDetails.averageUntilFirstPossibleFinish =
                    opponentStats.reduce((acc, stat) => acc + stat.averageUntilFirstPossibleFinish, 0) /
                    opponentStats.length;
                opponentDetails.throwsOnDouble =
                    opponentStats.reduce((acc, stat) => acc + stat.throwsOnDouble, 0) / opponentStats.length;
            }

            headToHeadStats.push({
                player: {
                    id: playerId,
                    wins,
                    losses,
                    winRate,
                    ...(Object.keys(playerDetails).length > 0 ? (playerDetails as PlayerSummaryStatsDetails) : {}),
                },
                opponent: {
                    id: opponent,
                    ...(Object.keys(opponentDetails).length > 0 ? (opponentDetails as PlayerSummaryStatsDetails) : {}),
                    wins: losses,
                    losses: wins,
                    winRate: 1 - winRate,
                },
                totalGames: games.length,
            });
        }

        return headToHeadStats;
    }

    public async getPlayerEloHistory(playerId: string): Promise<EloHistoryResponseDTO[]> {
        // Fetch ELO history with game data included - need to use prisma directly to include relations
        const eloHistoryWithGame = await this.databaseEloHistoryService.getPlayerHistory(playerId, {
            game: {
                gameEnd: {
                    gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
                },
            },
        });

        return eloHistoryWithGame.map(
            (history): EloHistoryResponseDTO => ({
                id: history.id,
                timestamp: history.game.gameEnd.toISOString(),
                eloBefore: history.eloBefore,
                eloAfter: history.eloAfter,
                eloChange: history.eloAfter - history.eloBefore,
                gamesPlayedAfter: history.gamesPlayedAfter,
            }),
        );
    }

    public async getPlayerAverageHistory(playerId: string): Promise<AverageHistoryResponseDTO> {
        const averageHistory = await this.databaseGameStatisticService.getPlayerGameStatisticsHistory(playerId);
        const now = dayjs();
        const averages: Record<string, AverageObjectDTO> = {};
        const currentWeekAverage: AverageObjectDTO = {
            average: 0,
            scoringAverage: 0,
            numberOfGames: 0,
        };
        const currentMonthAverage: AverageObjectDTO = {
            average: 0,
            scoringAverage: 0,
            numberOfGames: 0,
        };
        const currentYearAverage: AverageObjectDTO = {
            average: 0,
            scoringAverage: 0,
            numberOfGames: 0,
        };

        for (const average of averageHistory) {
            const dateString = dayjs(average.game.gameEnd).format('YYYY-MM-DD');
            if (!averages[dateString]) {
                averages[dateString] = {
                    average: 0,
                    scoringAverage: 0,
                    numberOfGames: 0,
                };
            }

            averages[dateString].average += average.averageScore;
            averages[dateString].scoringAverage += average.averageUntilFirstPossibleFinish;
            averages[dateString].numberOfGames += 1;

            if (dayjs(dateString).isSame(now, 'week')) {
                currentWeekAverage.average += average.averageScore;
                currentWeekAverage.scoringAverage += average.averageUntilFirstPossibleFinish;
                currentWeekAverage.numberOfGames += 1;
            }

            if (dayjs(dateString).isSame(now, 'month')) {
                currentMonthAverage.average += average.averageScore;
                currentMonthAverage.scoringAverage += average.averageUntilFirstPossibleFinish;
                currentMonthAverage.numberOfGames += 1;
            }

            if (dayjs(dateString).isSame(now, 'year')) {
                currentYearAverage.average += average.averageScore;
                currentYearAverage.scoringAverage += average.averageUntilFirstPossibleFinish;
                currentYearAverage.numberOfGames += 1;
            }
        }

        for (const date in averages) {
            if (averages[date].numberOfGames > 0) {
                averages[date].average /= averages[date].numberOfGames;
                averages[date].scoringAverage /= averages[date].numberOfGames;
            }
        }

        if (currentWeekAverage.numberOfGames > 0) {
            currentWeekAverage.average /= currentWeekAverage.numberOfGames;
            currentWeekAverage.scoringAverage /= currentWeekAverage.numberOfGames;
        }
        if (currentMonthAverage.numberOfGames > 0) {
            currentMonthAverage.average /= currentMonthAverage.numberOfGames;
            currentMonthAverage.scoringAverage /= currentMonthAverage.numberOfGames;
        }
        if (currentYearAverage.numberOfGames > 0) {
            currentYearAverage.average /= currentYearAverage.numberOfGames;
            currentYearAverage.scoringAverage /= currentYearAverage.numberOfGames;
        }

        return {
            currentWeek: currentWeekAverage,
            currentMonth: currentMonthAverage,
            currentYear: currentYearAverage,
            dailyAverages: averages,
        };
    }
}
