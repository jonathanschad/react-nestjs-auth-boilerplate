import type { GameCheckoutMode, GameType } from '@darts/prisma';
import { ValidateEnum } from '../util/validate-enum';
import { EloHistoryEntityApiDTO, OpenSkillHistoryEntityApiDTO } from './history';

export enum GameTypeDTOEnum {
    X301 = 'X301',
    X501 = 'X501',
}

export enum GameCheckoutModeDTOEnum {
    SINGLE_OUT = 'SINGLE_OUT',
    DOUBLE_OUT = 'DOUBLE_OUT',
    MASTER_OUT = 'MASTER_OUT',
}

const _validateGameTypeEnum: ValidateEnum<GameType> = GameTypeDTOEnum;
const _validateGameCheckoutModeEnum: ValidateEnum<GameCheckoutMode> = GameCheckoutModeDTOEnum;

export type GameTurnEntityApiDTO = {
    id: string;
    playerId: string;
    turnNumber: number;
    throw1: number | null;
    throw1Multiplier: number | null;
    throw2: number | null;
    throw2Multiplier: number | null;
    throw3: number | null;
    throw3Multiplier: number | null;
    totalScore: number;
};

export type GameStatisticsEntityApiDTO = {
    id: string;
    playerId: string;
    wonBullOff: boolean;
    averageScore: number;
    averageUntilFirstPossibleFinish: number;
    throwsOnDouble: number;
};

export type GameEntityApiDTO = {
    id: string;
    playerA: {
        id: string;
        turns: GameTurnEntityApiDTO[];
        gameStatistics?: GameStatisticsEntityApiDTO;
        eloHistory: EloHistoryEntityApiDTO;
        openSkillHistory: OpenSkillHistoryEntityApiDTO;
    };
    playerB: {
        id: string;
        turns: GameTurnEntityApiDTO[];
        gameStatistics?: GameStatisticsEntityApiDTO;
        eloHistory: EloHistoryEntityApiDTO;
        openSkillHistory: OpenSkillHistoryEntityApiDTO;
    };
    winnerId: string;
    loserId: string;
    gameStart: Date;
    gameEnd: Date;
    type: GameTypeDTOEnum;
    checkoutMode: GameCheckoutModeDTOEnum;
};
