import { Injectable } from '@nestjs/common';
import { ordinal, type Rating, rate } from 'openskill';
import { GameResult, RankingService } from '@/dart/ranking/ranking';

/**
 * Service for calculating ELO ratings between two players
 * Uses the standard ELO rating system with a K-factor of 32
 */
@Injectable()
export class OpenSkillService implements RankingService<Rating> {
    public getNewRankings(
        ratingPlayerA: Rating,
        ratingPlayerB: Rating,
        result: GameResult,
    ): {
        playerA: {
            previousRating: Rating;
            newRating: Rating;
        };
        playerB: {
            previousRating: Rating;
            newRating: Rating;
        };
    } {
        const [[newRatingPlayerA], [newRatingPlayerB]] = rate([[ratingPlayerA], [ratingPlayerB]], {
            rank: [result === GameResult.WIN_PLAYER_A ? 1 : 2, result === GameResult.WIN_PLAYER_B ? 1 : 2],
        });

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

    public compareRankings(ratingPlayerA: Rating, ratingPlayerB: Rating): number {
        return ordinal(ratingPlayerA) - ordinal(ratingPlayerB);
    }

    public formatRatingIntoScore(rating: Rating): number {
        return ordinal(rating);
    }
}
