import type { Rating } from 'openskill';
import { PublicUser } from '../../entities/user';
import { ApiGetEndpoint } from '../api';

export type EloRating = {
    elo: number;
    gamesPlayed: number;
};

export type EloRankingResponseDTO = {
    user: PublicUser;
    rank: number;
    score: number;
    rating: EloRating;
    gamesPlayed: number;
};

export type OpenSkillRankingResponseDTO = {
    user: PublicUser;
    rank: number;
    score: number;
    rating: Rating;
    gamesPlayed: number;
};

export type RankingController = {
    elo: ApiGetEndpoint<void, EloRankingResponseDTO[]>;
    openskill: ApiGetEndpoint<void, OpenSkillRankingResponseDTO[]>;
};
