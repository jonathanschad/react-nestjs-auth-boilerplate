import { Injectable } from '@nestjs/common';

import { DatabaseEloHistoryService } from '@/database/elo-history/elo-history.service';
import { GameWithTurns } from '@/types/prisma';

/**
 * Service for calculating ELO ratings between two players
 * Uses the standard ELO rating system with a K-factor of 32
 */
@Injectable()
export class EloService {
    private readonly K_FACTOR = 32;
    private readonly DEFAULT_ELO = 1000;

    constructor(private readonly databaseEloHistoryService: DatabaseEloHistoryService) {}

    /**
     * Calculate the expected score for a player given two ELO ratings
     * @param playerRating The rating of the player
     * @param opponentRating The rating of the opponent
     * @returns The expected score (probability of winning, between 0 and 1)
     */
    private calculateExpectedScore(playerRating: number, opponentRating: number): number {
        return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    }

    /**
     * Calculate the new ELO rating for a player
     * @param currentRating The player's current ELO rating
     * @param expectedScore The expected score (probability of winning)
     * @param actualScore The actual score (1 for win, 0 for loss, 0.5 for draw)
     * @returns The new ELO rating
     */
    private calculateNewRating(currentRating: number, expectedScore: number, actualScore: number): number {
        return currentRating + this.K_FACTOR * (actualScore - expectedScore);
    }

    /**
     * Calculate ELO changes for two players after a game
     * @param input The input data containing player IDs, current ELOs, and winner
     * @returns The ELO calculation result with before/after ratings and changes
     */
    public async calculateEloChangesForGame(game: GameWithTurns): Promise<EloCalculationResult> {
        const { playerAId, playerBId, winnerId } = game;

        const playerACurrentElo =
            (await this.databaseEloHistoryService.getCurrentEloByUserId(playerAId)) ?? this.DEFAULT_ELO;
        const playerBCurrentElo =
            (await this.databaseEloHistoryService.getCurrentEloByUserId(playerBId)) ?? this.DEFAULT_ELO;

        // Determine actual scores (1 for win, 0 for loss)
        const playerAActualScore = winnerId === playerAId ? 1 : 0;
        const playerBActualScore = winnerId === playerBId ? 1 : 0;

        // Calculate expected scores
        const playerAExpectedScore = this.calculateExpectedScore(playerACurrentElo, playerBCurrentElo);
        const playerBExpectedScore = this.calculateExpectedScore(playerBCurrentElo, playerACurrentElo);

        // Calculate new ratings
        const playerAEloAfter = Math.round(
            this.calculateNewRating(playerACurrentElo, playerAExpectedScore, playerAActualScore),
        );
        const playerBEloAfter = Math.round(
            this.calculateNewRating(playerBCurrentElo, playerBExpectedScore, playerBActualScore),
        );

        // Calculate changes
        const playerAEloChange = playerAEloAfter - playerACurrentElo;
        const playerBEloChange = playerBEloAfter - playerBCurrentElo;

        return {
            playerA: {
                loss: ,
                win: , 
            },
            playerB: {
                loss: ,
                win: , 
            },
        };
    }

    /**
     * Get current ELO ratings for two players and calculate new ratings based on game result
     * @param playerAId The ID of player A
     * @param playerBId The ID of player B
     * @param winnerId The ID of the winner
     * @returns The ELO calculation result
     */
    async calculateEloForGameByUserIds(
        playerAId: string,
        playerBId: string,
        winnerId: string,
    ): Promise<EloCalculationResult> {
        // Get current ELO ratings from database, or use default if no history exists
        const playerACurrentElo =
            (await this.databaseEloHistoryService.getCurrentEloByUserId(playerAId)) ?? this.DEFAULT_ELO;
        const playerBCurrentElo =
            (await this.databaseEloHistoryService.getCurrentEloByUserId(playerBId)) ?? this.DEFAULT_ELO;

        return this.calculateEloForGame({
            playerAId,
            playerBId,
            playerACurrentElo,
            playerBCurrentElo,
            winnerId,
        });
    }

    /**
     * Convert ELO calculation result to player updates array
     * @param result The ELO calculation result
     * @returns Array of player ELO updates
     */
    getPlayerUpdatesFromResult(result: EloCalculationResult): PlayerEloUpdate[] {
        return [
            {
                playerId: result.playerAId,
                eloBefore: result.playerAEloBefore,
                eloAfter: result.playerAEloAfter,
                eloChange: result.playerAEloChange,
            },
            {
                playerId: result.playerBId,
                eloBefore: result.playerBEloBefore,
                eloAfter: result.playerBEloAfter,
                eloChange: result.playerBEloChange,
            },
        ];
    }
}
