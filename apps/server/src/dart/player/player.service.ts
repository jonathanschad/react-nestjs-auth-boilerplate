import type {
    GameEntityApiDTO,
    Pagination,
    PlayerDetailsResponseDTO,
    PlayerOpponentsResponseDTO,
    PlayerResponseDTO,
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

            playerResponse.push({
                id: user.id,
                name: user.name ?? '',
                currentElo: currentUserEloRating.elo,
                lastGamePlayedAt: mostRecentGame?.createdAt?.toISOString() ?? null,
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

    public async getPlayerOpponents(playerId: string): Promise<PlayerOpponentsResponseDTO> {
        const opponents = await this.databaseGameService.getOpponentsByUserId(playerId);

        return opponents.map((opponent) => ({
            opponentId: opponent,
        }));
    }
}
