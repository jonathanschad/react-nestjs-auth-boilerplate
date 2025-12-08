import { GameType } from '@darts/prisma';

const POSSIBLE_SCORE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];

export const getPossibleFinishes = () => {
    return POSSIBLE_SCORE_VALUES.map((score) => {
        return score * 2;
    });
};

export const getPointsForGameType = (gameType: GameType) => {
    switch (gameType) {
        case 'X301':
            return 301;
        case 'X501':
            return 501;
    }
};

export const getGameTypeFromScore = (score: number) => {
    if (score === 501) return GameType.X501;
    else if (score === 301) return GameType.X301;
    else throw new Error('Invalid score');
};
