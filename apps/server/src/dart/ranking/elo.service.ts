import { Injectable } from '@nestjs/common';
import { GameResult, RankingService } from '@/dart/ranking/ranking';

export const DEFAULT_ELO = 1000;

@Injectable()
export class EloService implements RankingService<number> {
    private readonly K_FACTOR = 32;
    private readonly EXPONENT_BASE = 10;
    private readonly DEFAULT_ELO = DEFAULT_ELO;
    private readonly SCALE_FACTOR = 400;

    constructor() {}

    private calculateWinProbability(
        ratingPlayerA: number,
        ratingPlayerB: number,
    ): {
        winProbabilityPlayerA: number;
        winProbabilityPlayerB: number;
    } {
        return {
            winProbabilityPlayerA:
                1 / (1 + this.EXPONENT_BASE ** ((ratingPlayerB - ratingPlayerA) / this.SCALE_FACTOR)),
            winProbabilityPlayerB:
                1 / (1 + this.EXPONENT_BASE ** ((ratingPlayerA - ratingPlayerB) / this.SCALE_FACTOR)),
        };
    }

    private calculateNewRating(playerRating: number, winProbability: number, normalizedResult: number): number {
        return playerRating + this.K_FACTOR * (normalizedResult - winProbability);
    }

    public getNewRankings(
        ratingPlayerA: number,
        ratingPlayerB: number,
        result: GameResult,
    ): {
        playerA: {
            previousRating: number;
            newRating: number;
        };
        playerB: {
            previousRating: number;
            newRating: number;
        };
    } {
        const { winProbabilityPlayerA, winProbabilityPlayerB } = this.calculateWinProbability(
            ratingPlayerA,
            ratingPlayerB,
        );
        const newRatingPlayerA = this.calculateNewRating(
            ratingPlayerA,
            winProbabilityPlayerA,
            result === GameResult.WIN_PLAYER_A ? 1 : 0,
        );
        const newRatingPlayerB = this.calculateNewRating(
            ratingPlayerB,
            winProbabilityPlayerB,
            result === GameResult.WIN_PLAYER_B ? 1 : 0,
        );

        return {
            playerA: {
                previousRating: ratingPlayerA,
                newRating: newRatingPlayerA,
            },
            playerB: {
                previousRating: ratingPlayerB,
                newRating: newRatingPlayerB,
            },
        };
    }

    public formatRatingIntoScore(rating: number): number {
        return rating;
    }

    public compareRankings(ratingPlayerA: number, ratingPlayerB: number): number {
        return ratingPlayerA - ratingPlayerB;
    }
}
