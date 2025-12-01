import { PaginatedResponse } from '@darts/types/api/api';
import type { PlayerDetailsResponseDTO, PlayerResponseDTO } from '@darts/types/api/player/player.dto';
import type { GameEntityApiDTO } from '@darts/types/entities/game';
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

    async getPlayerGames(
        playerId: string,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<PaginatedResponse<GameEntityApiDTO>> {
        const { games, total } = await this.databaseGameService.getGamesByUserIdPaginated(playerId, page, pageSize);

        const gamesDto = games.map((game) => this.databaseGameService.mapGameToDTO(game));

        const totalPages = Math.ceil(total / pageSize);

        return {
            data: gamesDto,
            pagination: {
                page,
                pageSize,
                totalItems: total,
                totalPages,
            },
        };
    }
}
