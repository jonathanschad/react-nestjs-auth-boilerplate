import type { Rating } from 'openskill';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint } from '../api';

export type EloRating = {
    elo: number;
    gamesPlayed: number;
};

export type EloRankingResponseDTO = {
    userId: string;
    rank: number;
    score: number;
    rating: EloRating;
    gamesPlayed: number;
};

export type OpenSkillRankingResponseDTO = {
    userId: string;
    rank: number;
    score: number;
    rating: Rating;
};

export type EloHistoryEntityApiDTO = {
    id: string;
    gameId: string;
    playerId: string;
    eloBefore: number;
    eloAfter: number;
    gamesPlayedBefore: number;
    gamesPlayedAfter: number;
};

export type OpenSkillHistoryEntityApiDTO = {
    id: string;
    gameId: string;
    playerId: string;
    muBefore: number;
    muAfter: number;
    sigmaBefore: number;
    sigmaAfter: number;
    ordinalBefore: number;
    ordinalAfter: number;
};

export type RankingController = {
    elo: ApiGetEndpoint<void, EloRankingResponseDTO[]>;
    openskill: ApiGetEndpoint<void, OpenSkillRankingResponseDTO[]>;
};
