import { EloRating } from '@darts/types/api/ranking/ranking.dto';
import { Injectable } from '@nestjs/common';
import { GameResult, RankingServiceInterface } from '@/dart/ranking/ranking';

export const DEFAULT_ELO = 1000;

@Injectable()
export class EloService implements RankingServiceInterface<EloRating> {
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

    private getKFactor(gamesPlayed: number): number {
        if (gamesPlayed < 30) return 32;
        if (gamesPlayed < 100) return 24;
        return 16;
    }

    private calculateNewRating(playerRating: EloRating, winProbability: number, normalizedResult: number): number {
        return playerRating.elo + this.getKFactor(playerRating.gamesPlayed) * (normalizedResult - winProbability);
    }

    public getNewRankings(
        ratingPlayerA: EloRating,
        ratingPlayerB: EloRating,
        result: GameResult,
    ): {
        playerA: {
            previousRating: EloRating;
            newRating: EloRating;
        };
        playerB: {
            previousRating: EloRating;
            newRating: EloRating;
        };
    } {
        const { winProbabilityPlayerA, winProbabilityPlayerB } = this.calculateWinProbability(
            ratingPlayerA.elo,
            ratingPlayerB.elo,
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
                newRating: {
                    elo: newRatingPlayerA,
                    gamesPlayed: ratingPlayerA.gamesPlayed + 1,
                },
            },
            playerB: {
                previousRating: ratingPlayerB,
                newRating: {
                    elo: newRatingPlayerB,
                    gamesPlayed: ratingPlayerB.gamesPlayed + 1,
                },
            },
        };
    }

    public formatRatingIntoScore(rating: EloRating): number {
        return rating.elo;
    }

    public compareRankings(ratingPlayerA: EloRating, ratingPlayerB: EloRating): number {
        return ratingPlayerA.elo - ratingPlayerB.elo;
    }
}
