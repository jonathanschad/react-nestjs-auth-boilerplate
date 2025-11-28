export enum GameResult {
    WIN_PLAYER_A = 'WIN_PLAYER_A',
    WIN_PLAYER_B = 'WIN_PLAYER_B',
}

export class RankingService<Rating> {
    public getNewRankings(
        _ratingPlayerA: Rating,
        _ratingPlayerB: Rating,
        _result: GameResult,
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
        throw new Error('Not implemented');
    }

    /**
     * 1 if player A is better than player B
     * 0 if player A and player B have the same ranking
     * -1 if player B is better than player A
     */
    public compareRankings(_ratingPlayerA: Rating, _ratingPlayerB: Rating): number {
        throw new Error('Not implemented');
    }

    /**
     * Formats a potential complex rating into a single number
     */
    public formatRatingIntoScore(_rating: Rating): number {
        throw new Error('Not implemented');
    }
}
