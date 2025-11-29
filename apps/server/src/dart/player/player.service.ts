import type { PlayerDetailsResponseDTO, PlayerResponseDTO } from '@darts/types/api/player/player.dto';
import { Injectable } from '@nestjs/common';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';
import { DatabaseUserService } from '@/database/user/user.service';

@Injectable()
export class PlayerService {
    constructor(
        private readonly databaseUserService: DatabaseUserService,
        private readonly databaseGameService: DatabaseGameService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
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

        // Get current ratings
        const currentEloHistory = await this.databaseEloHistoryService.getCurrentRatingByUserId(playerId);
        const currentEloRating = this.databaseEloHistoryService.getRatingFromHistoryEntry(currentEloHistory);

        const currentOpenSkillHistory = await this.databaseOpenSkillHistoryService.getCurrentRatingByUserId(playerId);
        const currentOpenSkillRating =
            this.databaseOpenSkillHistoryService.getRatingFromHistoryEntry(currentOpenSkillHistory);

        // TODO: Improve this
        const games = await this.databaseGameService.getGamesByUserId(playerId);
        const gamesPlayed = games.length;
        const mostRecentGame = games.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

        // Calculate win/loss record
        const wins = games.filter((game) => game.winnerId === playerId).length;
        const losses = gamesPlayed - wins;

        return {
            player: {
                id: user.id,
                name: user.name ?? '',
                profilePictureId: user.profilePictureId,
            },
            currentRating: {
                elo: currentEloRating,
                openSkill: currentOpenSkillRating,
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
}
