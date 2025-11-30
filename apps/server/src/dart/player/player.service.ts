import { PaginatedResponse } from '@darts/types/api/api';
import type { GameEntityApiDTO } from '@darts/types/api/game/game.dto';
import type { PlayerDetailsResponseDTO, PlayerResponseDTO } from '@darts/types/api/player/player.dto';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
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

        let cachedEloRating = this.rankingService.getCachedEloRanking(playerId);
        let cachedOpenSkillRating = this.rankingService.getCachedOpenSkillRanking(playerId);

        if (!cachedEloRating || !cachedOpenSkillRating) {
            await this.rankingService.updateCachedRankings();

            cachedEloRating = this.rankingService.getCachedEloRanking(playerId);
            cachedOpenSkillRating = this.rankingService.getCachedOpenSkillRanking(playerId);
        }
        assert(cachedEloRating);
        assert(cachedOpenSkillRating);

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

        const gamesDto: GameEntityApiDTO[] = [];

        for (const game of games) {
            const playerA = await this.databaseUserService.findByUuid(game.playerAId);
            const playerB = await this.databaseUserService.findByUuid(game.playerBId);
            const winner = await this.databaseUserService.findByUuid(game.winnerId);
            const loser = game.winnerId === game.playerAId ? playerB : playerA;

            const playerAEloHistory = game.eloHistory.find((history) => history.playerId === playerA.id);
            const playerBEloHistory = game.eloHistory.find((history) => history.playerId === playerB.id);
            const playerAOpenSkillHistory = game.openSkillHistory.find((history) => history.playerId === playerA.id);
            const playerBOpenSkillHistory = game.openSkillHistory.find((history) => history.playerId === playerB.id);

            assert(playerAEloHistory);
            assert(playerBEloHistory);
            assert(playerAOpenSkillHistory);
            assert(playerBOpenSkillHistory);

            gamesDto.push({
                id: game.id,
                playerA: {
                    id: playerA.id,
                    turns: game.turns.filter((turn) => turn.playerId === playerA.id),
                    gameStatistics: game.gameStatistics.find((stat) => stat.playerId === playerA.id),
                    eloHistory: playerAEloHistory,
                    openSkillHistory: playerAOpenSkillHistory,
                },
                playerB: {
                    id: playerB.id,
                    turns: game.turns.filter((turn) => turn.playerId === playerB.id),
                    gameStatistics: game.gameStatistics.find((stat) => stat.playerId === playerB.id),
                    eloHistory: playerBEloHistory,
                    openSkillHistory: playerBOpenSkillHistory,
                },
                winnerId: winner.id,
                loserId: loser.id,
                gameStart: game.gameStart,
                gameEnd: game.gameEnd,
                type: game.type,
                checkoutMode: game.checkoutMode,
            });
        }

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
