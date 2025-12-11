import type {
    EloHistoryResponseDTO,
    GameEntityApiDTO,
    HeadToHeadStats,
    Pagination,
    PlayerDetailsResponseDTO,
    PlayerResponseDTO,
    PlayerSummaryStatsDetails,
} from '@darts/types';
import { Injectable } from '@nestjs/common';
import { RankingService } from '@/dart/ranking/ranking.service';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class PlayerService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly rankingService: RankingService,
    ) {}

    async getAllPlayers(): Promise<PlayerResponseDTO[]> {
        const users = await this.databaseUserService.findAll();

        const playerResponse: PlayerResponseDTO[] = [];

        for (const user of users) {
            const mostRecentGame = await this.databaseGameService.getMostRecentGameByUserId(user.id);
            const currentUserElo = await this.databaseEloHistoryService.getCurrentRatingByUserId(user.id);
            const currentUserEloRating = this.databaseEloHistoryService.getRatingFromHistoryEntry(currentUserElo);
            console.log(currentUserEloRating);
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
}
