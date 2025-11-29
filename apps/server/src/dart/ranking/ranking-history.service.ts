import { Game } from '@darts/prisma';
import { Injectable } from '@nestjs/common';
import { ordinal } from 'openskill';
import { EloService } from '@/dart/ranking/elo.service';
import { OpenSkillService } from '@/dart/ranking/openskill.service';
import { GameResult } from '@/dart/ranking/ranking';
import { DatabaseGameService } from '@/database/game/game.service';
import { DatabaseEloHistoryService } from '@/database/history/elo-history.service';
import { DatabaseOpenSkillHistoryService } from '@/database/history/openskill-history.service';

@Injectable()
export class RankingHistoryService {
    constructor(
        private readonly eloService: EloService,
        private readonly openSkillService: OpenSkillService,
        private readonly databaseEloHistoryService: DatabaseEloHistoryService,
        private readonly databaseOpenSkillHistoryService: DatabaseOpenSkillHistoryService,
        private readonly databaseGameService: DatabaseGameService,
    ) {}

    public async calculateNewRankings(game: Game) {
        const gameResult = game.winnerId === game.playerAId ? GameResult.WIN_PLAYER_A : GameResult.WIN_PLAYER_B;

        await this.createEloHistoryEntry(game, game.playerAId, game.playerBId, gameResult);
        await this.createOpenSkillHistoryEntry(game, game.playerAId, game.playerBId, gameResult);
    }

    public async recalculateHistory() {
        await this.databaseEloHistoryService.clearHistory();
        await this.databaseOpenSkillHistoryService.clearHistory();

        const games = await this.databaseGameService.getAllGamesAsc();

        for (const game of games) {
            await this.calculateNewRankings(game);
        }
    }

    private async createEloHistoryEntry(game: Game, playerAId: string, playerBId: string, gameResult: GameResult) {
        const playerAElo = await this.databaseEloHistoryService.getCurrentRatingByUserId(playerAId);
        const playerBElo = await this.databaseEloHistoryService.getCurrentRatingByUserId(playerBId);

        const playerAEloRating = this.databaseEloHistoryService.getRatingFromHistoryEntry(playerAElo);
        const playerBEloRating = this.databaseEloHistoryService.getRatingFromHistoryEntry(playerBElo);

        const newRankings = this.eloService.getNewRankings(playerAEloRating, playerBEloRating, gameResult);

        await this.databaseEloHistoryService.createHistoryEntry({
            eloBefore: newRankings.playerA.previousRating.elo,
            eloAfter: newRankings.playerA.newRating.elo,
            gamesPlayedBefore: newRankings.playerA.previousRating.gamesPlayed,
            gamesPlayedAfter: newRankings.playerA.newRating.gamesPlayed,
            game: {
                connect: {
                    id: game.id,
                },
            },
            player: {
                connect: {
                    id: playerAId,
                },
            },
        });

        await this.databaseEloHistoryService.createHistoryEntry({
            eloBefore: newRankings.playerB.previousRating.elo,
            eloAfter: newRankings.playerB.newRating.elo,
            gamesPlayedBefore: newRankings.playerB.previousRating.gamesPlayed,
            gamesPlayedAfter: newRankings.playerB.newRating.gamesPlayed,
            game: {
                connect: {
                    id: game.id,
                },
            },
            player: {
                connect: {
                    id: playerBId,
                },
            },
        });
    }

    private async createOpenSkillHistoryEntry(
        game: Game,
        playerAId: string,
        playerBId: string,
        gameResult: GameResult,
    ) {
        const playerAOpenSkill = await this.databaseOpenSkillHistoryService.getCurrentRatingByUserId(playerAId);
        const playerBOpenSkill = await this.databaseOpenSkillHistoryService.getCurrentRatingByUserId(playerBId);

        const playerAOpenSkillRating = this.databaseOpenSkillHistoryService.getRatingFromHistoryEntry(playerAOpenSkill);
        const playerBOpenSkillRating = this.databaseOpenSkillHistoryService.getRatingFromHistoryEntry(playerBOpenSkill);

        const newRankings = this.openSkillService.getNewRankings(
            playerAOpenSkillRating,
            playerBOpenSkillRating,
            gameResult,
        );

        await this.databaseOpenSkillHistoryService.createHistoryEntry({
            muBefore: newRankings.playerA.previousRating.mu,
            muAfter: newRankings.playerA.newRating.mu,
            sigmaBefore: newRankings.playerA.previousRating.sigma,
            sigmaAfter: newRankings.playerA.newRating.sigma,
            ordinalBefore: ordinal(newRankings.playerA.previousRating),
            ordinalAfter: ordinal(newRankings.playerA.newRating),
            game: {
                connect: {
                    id: game.id,
                },
            },
            player: {
                connect: {
                    id: playerAId,
                },
            },
        });

        await this.databaseOpenSkillHistoryService.createHistoryEntry({
            muBefore: newRankings.playerB.previousRating.mu,
            muAfter: newRankings.playerB.newRating.mu,
            sigmaBefore: newRankings.playerB.previousRating.sigma,
            sigmaAfter: newRankings.playerB.newRating.sigma,
            ordinalBefore: ordinal(newRankings.playerB.previousRating),
            ordinalAfter: ordinal(newRankings.playerB.newRating),
            game: {
                connect: {
                    id: game.id,
                },
            },
            player: {
                connect: {
                    id: playerBId,
                },
            },
        });
    }
}
